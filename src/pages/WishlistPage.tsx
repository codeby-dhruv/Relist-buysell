import { Heart } from 'lucide-react';
import { ProductGrid } from '@components/product/ProductGrid';
import { EmptyState } from '@components/ui/EmptyState';
import { products } from '@services/mockData';
import { useAppStore } from '@store/useAppStore';

export function WishlistPage() {
  const wishlist = useAppStore((state) => state.wishlist);
  const savedProducts = products.filter((product) => wishlist.includes(product.id));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Saved products</h1>
      {savedProducts.length ? (
        <ProductGrid products={savedProducts} />
      ) : (
        <EmptyState icon={<Heart className="size-6" />} title="No saved listings yet" body="Tap the heart on any product to keep it close." />
      )}
    </div>
  );
}
