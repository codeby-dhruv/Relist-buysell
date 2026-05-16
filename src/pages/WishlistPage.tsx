import { Heart, MapPin, ShieldCheck, Trash2, Loader2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { copy } from '@constants/languages';
import { getProducts } from '@services/productService';
import { useAppStore } from '@store/useAppStore';
import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '@utils/format';
import type { Product } from '@/types/models';

export function WishlistPage() {
  const wishlist = useAppStore((state) => state.wishlist);
  const language = useAppStore((state) => state.language);
  const t = copy[language];

  // Load ALL products then filter by wishlist IDs client-side
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products', {}],
    queryFn: () => getProducts({}),
  });

  const savedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="space-y-5 px-4 pt-4 md:px-0 md:pt-0">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-normal text-slate-400">{t.savedCollection}</p>
            <h1 className="inter-copy mt-2 text-3xl font-semibold">{t.savedProducts}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {t.savedProductsDesc}
            </p>
          </div>
          <div className="w-fit rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
            <p className="inter-copy text-2xl font-semibold">{isLoading ? '—' : savedProducts.length}</p>
            <p className="text-xs font-normal text-slate-500">{t.savedItems}</p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-teal-500" />
        </div>
      ) : savedProducts.length ? (
        <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
          <div className="divide-y divide-slate-100 dark:divide-white/10">
            {savedProducts.map((product) => (
              <SavedListing key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
            <Package className="size-7 text-slate-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-white">{t.noSavedListings}</p>
            <p className="mt-1 text-sm text-slate-500">{t.noSavedDesc}</p>
          </div>
          <Link to="/" className="rounded-2xl bg-teal-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-600 transition">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}

function SavedListing({ product }: { product: Product }) {
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const language = useAppStore((state) => state.language);
  const t = copy[language];

  return (
    <article className="grid grid-cols-[92px_1fr] gap-3 p-4 transition hover:bg-slate-50 dark:hover:bg-white/5 md:grid-cols-[112px_1fr_auto] md:items-center md:p-5">
      <Link to={`/products/${product.id}`} className="block aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5">
        <img src={product.imageUrls[0]} alt={product.title} className="h-full w-full object-cover" loading="lazy" />
      </Link>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {product.isFeatured && <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-normal text-teal-700 dark:text-teal-300">{t.featured}</span>}
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-normal capitalize text-slate-600 dark:bg-white/10 dark:text-slate-300">{product.category}</span>
        </div>
        <Link to={`/products/${product.id}`} className="inter-copy mt-2 block line-clamp-1 font-medium text-slate-950 dark:text-white">
          {product.title}
        </Link>
        <p className="inter-copy mt-1 text-xl font-semibold">{formatPrice(product.price)}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" /> {product.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-emerald-500" /> {product.sellerName}
          </span>
        </div>
      </div>

      <div className="col-span-2 flex gap-2 md:col-span-1 md:w-40 md:flex-col">
        <Link to={`/products/${product.id}`} className="flex h-10 flex-1 items-center justify-center rounded-xl bg-slate-950 px-3 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
          {t.viewDetails}
        </Link>
        <button
          onClick={() => toggleWishlist(product.id)}
          className="grid h-10 w-12 place-items-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10"
          aria-label="Remove saved listing"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </article>
  );
}


