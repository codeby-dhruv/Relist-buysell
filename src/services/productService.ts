import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  type QueryConstraint,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/firebase/config';
import { products as fallbackProducts } from '@services/mockData';
import type { Product, ProductCategory } from '@/types/models';

const collectionName = 'products';

export interface ProductFilters {
  search?: string;
  category?: ProductCategory | 'all';
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (!db) return applyLocalFilters(fallbackProducts, filters);

  try {
    const constraints: QueryConstraint[] = [orderBy(filters.sort === 'popular' ? 'views' : 'createdAt', 'desc'), limit(24)];
    if (filters.category && filters.category !== 'all') {
      constraints.unshift(where('category', '==', filters.category));
    }

    const snapshot = await getDocs(query(collection(db, collectionName), ...constraints));
    const remote = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Product);
    return applyLocalFilters(remote.length ? remote : fallbackProducts, filters);
  } catch {
    return applyLocalFilters(fallbackProducts, filters);
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!db) return fallbackProducts.find((product) => product.id === id);

  try {
    const snapshot = await getDoc(doc(db, collectionName, id));
    if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() } as Product;
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
    const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
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
