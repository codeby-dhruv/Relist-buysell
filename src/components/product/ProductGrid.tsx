import { PackageSearch } from 'lucide-react';
import { ProductCard } from '@components/product/ProductCard';
import { EmptyState } from '@components/ui/EmptyState';
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
    return <EmptyState icon={<PackageSearch className="size-6" />} title="No listings found" body="Try a different search, category, or sorting option." />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
