import { PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@components/product/ProductCard';
import { Skeleton } from '@components/ui/Skeleton';
import type { Product } from '@/types/models';

export function ProductGrid({ products, loading }: { products?: Product[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/3] rounded-[28px]" />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
          <PackageSearch className="size-7 text-slate-400" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 dark:text-white">No listings found</p>
          <p className="mt-1 text-sm text-slate-500">No products in this category yet. Be the first to list!</p>
        </div>
        <div className="flex gap-3">
          <Link to="/categories" className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white">
            ← Back to Categories
          </Link>
          <Link to="/sell" className="rounded-2xl bg-teal-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-600">
            Add Listing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
