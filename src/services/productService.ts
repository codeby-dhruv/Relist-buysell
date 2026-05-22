import {
  addDoc,
  collection,
  deleteDoc,
  documentId,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  type QueryConstraint,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/firebase/config';
import { products as fallbackProducts } from '@services/mockData';
import type { Product, ProductCategory } from '@/types/models';

const collectionName = 'products';
const DEFAULT_PAGE_SIZE = 20;

export interface ProductFilters {
  search?: string;
  category?: ProductCategory | 'all';
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (!db) return applyLocalFilters(fallbackProducts, filters);

  try {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(50)];
    if (filters.category && filters.category !== 'all') {
      constraints.unshift(where('category', '==', filters.category));
    }

    const snapshot = await getDocs(query(collection(db, collectionName), ...constraints));
    const remote = snapshot.docs.map((item) => normalizeProduct({ id: item.id, ...item.data() }));

    // Only fall back to mock data when no category filter is active (home feed)
    if (!remote.length && (!filters.category || filters.category === 'all')) {
      return applyLocalFilters(fallbackProducts, filters);
    }
    return applyLocalFilters(remote, filters);
  } catch {
    return applyLocalFilters(fallbackProducts, filters);
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!db) return fallbackProducts.find((product) => product.id === id);

  try {
    const snapshot = await getDoc(doc(db, collectionName, id));
    if (snapshot.exists()) return normalizeProduct({ id: snapshot.id, ...snapshot.data() });
  } catch {
    return fallbackProducts.find((product) => product.id === id);
  }

  return fallbackProducts.find((product) => product.id === id);
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'views' | 'saves'>) {
  if (!db) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* values to enable writes.');

  return addDoc(collection(db, collectionName), {
    ...product,
    createdAt: serverTimestamp(),
    views: 0,
    saves: 0
  });
}

export async function getProductsByUser(userId: string): Promise<Product[]> {
  if (!db) return [];
  try {
    const snapshot = await getDocs(
      query(collection(db, collectionName), where('sellerId', '==', userId), limit(50))
    );
    const products = snapshot.docs.map((d) => normalizeProduct({ id: d.id, ...d.data() }));
    return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function updateProduct(id: string, product: Partial<Product>) {
  if (!db) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* values to enable writes.');
  return updateDoc(doc(db, collectionName, id), product);
}

export async function deleteProduct(id: string) {
  if (!db) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* values to enable writes.');
  return deleteDoc(doc(db, collectionName, id));
}

export async function uploadProductImage(userId: string, file: File) {
  if (!storage) throw new Error('Firebase Storage is not configured. Add VITE_FIREBASE_* values to enable uploads.');

  const path = `products/${userId}/${crypto.randomUUID()}-${file.name}`;
  const uploadRef = ref(storage, path);
  const result = await uploadBytes(uploadRef, file);
  return getDownloadURL(result.ref);
}

export type ProductsCursor = { values: unknown[]; id: string } | null;

export async function getProductsPage(
  filters: ProductFilters = {},
  cursor: ProductsCursor = null,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<{ items: Product[]; nextCursor: ProductsCursor }> {
  const firestore = db;
  if (!firestore) {
    const filtered = applyLocalFilters(fallbackProducts, filters);
    const startIndex = cursor ? Math.max(filtered.findIndex((p) => p.id === cursor.id) + 1, 0) : 0;
    const items = filtered.slice(startIndex, startIndex + pageSize);
    const last = items.at(-1);
    return { items, nextCursor: last ? { values: [last.createdAt, last.id], id: last.id } : null };
  }

  try {
    const sortField = filters.sort === 'popular' ? 'views' : filters.sort?.startsWith('price') ? 'price' : 'createdAt';
    const sortDirection =
      filters.sort === 'price-asc' ? 'asc' : filters.sort === 'price-desc' ? 'desc' : 'desc';

    const baseConstraints: QueryConstraint[] = [
      orderBy(sortField, sortDirection),
      orderBy(documentId(), 'desc'),
      limit(pageSize)
    ];
    if (filters.category && filters.category !== 'all') {
      baseConstraints.unshift(where('category', '==', filters.category));
    }

    const constraints = cursor?.values?.length
      ? [...baseConstraints.slice(0, -1), startAfter(...cursor.values), baseConstraints.at(-1)!]
      : baseConstraints;

    const snapshot = await getDocs(query(collection(firestore, collectionName), ...constraints));
    const items = snapshot.docs.map((d) => normalizeProduct({ id: d.id, ...d.data() }));
    const lastDoc = snapshot.docs.at(-1);
    const nextCursor = lastDoc ? { values: [lastDoc.get(sortField), lastDoc.id], id: lastDoc.id } : null;

    return { items: applyLocalFilters(items, filters), nextCursor };
  } catch {
    const filtered = applyLocalFilters(fallbackProducts, filters);
    const startIndex = cursor ? Math.max(filtered.findIndex((p) => p.id === cursor.id) + 1, 0) : 0;
    const items = filtered.slice(startIndex, startIndex + pageSize);
    const last = items.at(-1);
    return { items, nextCursor: last ? { values: [last.createdAt, last.id], id: last.id } : null };
  }
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const uniqueIds = Array.from(new Set(ids)).filter(Boolean);
  if (!uniqueIds.length) return [];
  const firestore = db;
  if (!firestore) return fallbackProducts.filter((p) => uniqueIds.includes(p.id));

  try {
    const chunks = chunk(uniqueIds, 10);
    const snapshots = await Promise.all(
      chunks.map((batch) =>
        getDocs(query(collection(firestore, collectionName), where(documentId(), 'in', batch)))
      )
    );
    const items = snapshots.flatMap((snap) => snap.docs.map((d) => normalizeProduct({ id: d.id, ...d.data() })));
    const byId = new Map(items.map((p) => [p.id, p]));
    return uniqueIds.map((id) => byId.get(id)).filter(Boolean) as Product[];
  } catch {
    return [];
  }
}

function applyLocalFilters(items: Product[], filters: ProductFilters) {
  const search = filters.search?.trim().toLowerCase();
  const filtered = items.filter((product) => {
    const matchesSearch = search
      ? `${product.title} ${product.description} ${product.location}`.toLowerCase().includes(search)
      : true;
    const matchesCategory = filters.category && filters.category !== 'all' ? product.category === filters.category : true;
    return matchesSearch && matchesCategory;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === 'price-asc') return a.price - b.price;
    if (filters.sort === 'price-desc') return b.price - a.price;
    if (filters.sort === 'popular') return b.views - a.views;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function normalizeProduct(input: any): Product {
  const createdAtRaw = input?.createdAt;
  const createdAt =
    createdAtRaw?.toDate?.() instanceof Date
      ? createdAtRaw.toDate().toISOString()
      : typeof createdAtRaw === 'string'
        ? createdAtRaw
        : new Date().toISOString();

  return {
    id: String(input.id),
    title: String(input.title ?? ''),
    description: String(input.description ?? ''),
    price: Number(input.price ?? 0),
    category: input.category as ProductCategory,
    condition: input.condition,
    imageUrls: Array.isArray(input.imageUrls) ? input.imageUrls : [],
    sellerId: String(input.sellerId ?? ''),
    sellerName: String(input.sellerName ?? ''),
    sellerAvatar: input.sellerAvatar,
    location: String(input.location ?? ''),
    isFeatured: Boolean(input.isFeatured),
    createdAt,
    views: Number(input.views ?? 0),
    saves: Number(input.saves ?? 0)
  };
}

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}
