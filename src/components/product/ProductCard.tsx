import { Heart, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { useAppStore } from '@store/useAppStore';
import { formatPrice } from '@utils/format';
import type { Product } from '@/types/models';

export function ProductCard({ product }: { product: Product }) {
  const wishlist = useAppStore((state) => state.wishlist);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const saved = wishlist.includes(product.id);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-slate-950"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
          <img
            src={product.imageUrls[0]}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.isFeatured && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink backdrop-blur">
              Featured
            </span>
          )}
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/products/${product.id}`} className="line-clamp-1 font-bold text-ink dark:text-white">
              {product.title}
            </Link>
            <p className="mt-1 text-xl font-extrabold tracking-tight">{formatPrice(product.price)}</p>
          </div>
          <Button
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            variant="secondary"
            className="size-11 shrink-0 rounded-full p-0"
            onClick={() => toggleWishlist(product.id)}
            icon={<Heart className={saved ? 'size-5 fill-rose-500 text-rose-500' : 'size-5'} />}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {product.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {product.saves} saves
          </span>
        </div>
      </div>
    </motion.article>
  );
}
