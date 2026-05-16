import { Heart, MapPin, ShieldCheck, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@components/ui/EmptyState';
import { copy } from '@constants/languages';
import { products } from '@services/mockData';
import { useAppStore } from '@store/useAppStore';
import { formatPrice } from '@utils/format';
import type { Product } from '@/types/models';

export function WishlistPage() {
  const wishlist = useAppStore((state) => state.wishlist);
  const language = useAppStore((state) => state.language);
  const t = copy[language];
  const savedProducts = products.filter((product) => wishlist.includes(product.id));

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
            <p className="inter-copy text-2xl font-semibold">{savedProducts.length}</p>
            <p className="text-xs font-normal text-slate-500">{t.savedItems}</p>
          </div>
        </div>
      </section>

      {savedProducts.length ? (
        <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
          <div className="divide-y divide-slate-100 dark:divide-white/10">
            {savedProducts.map((product) => (
              <SavedListing key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState icon={<Heart className="size-6" />} title={t.noSavedListings} body={t.noSavedDesc} />
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


