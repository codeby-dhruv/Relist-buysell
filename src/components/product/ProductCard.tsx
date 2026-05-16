import { Bookmark, MapPin, Share2, Star } from 'lucide-react';
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
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 flex flex-col gap-1">
          {product.imageUrls.length >= 3 ? (
            <>
              <div className="h-2/3 w-full overflow-hidden">
                <img
                  src={product.imageUrls[0]}
                  alt={`${product.title} 1`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex h-1/3 w-full gap-1">
                <div className="h-full w-1/2 overflow-hidden">
                  <img
                    src={product.imageUrls[1]}
                    alt={`${product.title} 2`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="h-full w-1/2 overflow-hidden">
                  <img
                    src={product.imageUrls[2]}
                    alt={`${product.title} 3`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth">
              {product.imageUrls.map((imageUrl, index) => (
                <img
                  key={imageUrl}
                  src={imageUrl}
                  alt={`${product.title} ${index + 1}`}
                  className="h-full w-full shrink-0 snap-center object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ))}
            </div>
          )}
          {product.isFeatured && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-normal text-ink backdrop-blur">
              Featured
            </span>
          )}
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/products/${product.id}`} className="inter-copy line-clamp-1 font-medium text-ink dark:text-white">
              {product.title}
            </Link>
            <p className="inter-copy mt-1 text-xl font-semibold">{formatPrice(product.price)}</p>
          </div>
          <Button
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            variant="secondary"
            className="size-11 shrink-0 rounded-full p-0"
            onClick={() => toggleWishlist(product.id)}
            icon={<Bookmark className={saved ? 'size-5 fill-current' : 'size-5'} />}
          />
          <Button
            aria-label="Share listing"
            variant="secondary"
            className="size-11 shrink-0 rounded-full p-0"
            onClick={() => void shareProduct(product)}
            icon={<Share2 className="size-5" />}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-white/5">
          <div className="flex items-center gap-2">
            <img src={product.sellerAvatar || product.imageUrls[0]} alt="" className="size-6 rounded-full object-cover" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 line-clamp-1">{product.sellerName}</span>
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
      </div>
    </motion.article>
  );
}

async function shareProduct(product: Product) {
  const url = `${window.location.origin}/products/${product.id}`;
  const text = `${product.title} - ${formatPrice(product.price)}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: product.title, text, url });
    } catch {
      // User may cancel the native share sheet.
    }
    return;
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank', 'noreferrer');
}


