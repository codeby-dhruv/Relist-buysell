import { Link, useParams } from 'react-router-dom';
import { Bookmark, MapPin, MessageCircle, Share2, ShieldCheck, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@components/ui/Button';
import { Skeleton } from '@components/ui/Skeleton';
import { useProduct } from '@hooks/useProducts';
import { useAppStore } from '@store/useAppStore';
import { formatPrice } from '@utils/format';
import type { Product } from '@/types/models';

const fallbackWhatsappNumber = '919876543210';

export function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const wishlist = useAppStore((state) => state.wishlist);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const [expanded, setExpanded] = useState(false);

  if (isLoading) return <Skeleton className="h-[620px] rounded-[32px]" />;

  if (!product) {
    return (
      <div className="panel p-10 text-center">
        <h1 className="inter-copy text-2xl font-semibold">Listing unavailable</h1>
        <Link to="/" className="mt-4 inline-block text-sm font-bold text-[#5b2ee5]">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const saved = wishlist.includes(product.id);
  const whatsappUrl = buildWhatsappUrl(product);
  const isLongDescription = product.description.length > 120;
  const description = expanded || !isLongDescription ? product.description : `${product.description.slice(0, 120)}...`;

  return (
    <div className="pb-24 md:grid md:gap-6 md:pb-0 lg:grid-cols-[1fr_380px]">
      <section className="space-y-4 md:space-y-5">
        <div className="relative overflow-hidden bg-slate-100 shadow-soft dark:bg-slate-900 md:rounded-[32px]">
          <div className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
            {product.imageUrls.map((imageUrl, index) => (
              <img key={imageUrl} src={imageUrl} alt={`${product.title} ${index + 1}`} className="aspect-[1.02] w-full shrink-0 snap-center object-cover md:aspect-[4/3]" />
            ))}
          </div>
          {product.imageUrls.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-black/35 px-2 py-1 backdrop-blur">
              {product.imageUrls.map((imageUrl) => (
                <span key={imageUrl} className="size-1.5 rounded-full bg-white/85" />
              ))}
            </div>
          )}
          <div className="absolute bottom-4 left-4 rounded-full bg-white/92 px-3 py-2 text-xs font-normal text-slate-900 shadow-sm backdrop-blur md:hidden">
            {product.condition}
          </div>
          <button
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            onClick={() => toggleWishlist(product.id)}
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/92 text-slate-900 shadow-sm backdrop-blur md:hidden"
          >
            <Bookmark className={saved ? 'size-5 fill-current' : 'size-5'} />
          </button>
        </div>

        <div className="mx-4 rounded-[28px] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)] dark:bg-slate-950 md:mx-0 md:panel md:p-6">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span>{product.condition}</span>
            <span>·</span>
            <span>{product.category}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-4" />
              {product.location}
            </span>
          </div>
          <h1 className="inter-copy mt-3 text-2xl font-semibold sm:text-4xl">{product.title}</h1>
          <p className="inter-copy mt-2 text-3xl font-semibold text-[#5b2ee5]">{formatPrice(product.price)}</p>
          <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
            {description}
            {isLongDescription && (
              <button className="ml-1 font-medium text-slate-950 dark:text-white" onClick={() => setExpanded((value) => !value)}>
                {expanded ? 'show less' : 'read more'}
              </button>
            )}
          </p>
        </div>
      </section>

      <aside className="mx-4 mt-4 space-y-4 md:mx-0 md:mt-0 md:space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="panel hidden p-6 md:block">
          <p className="inter-copy text-4xl font-semibold">{formatPrice(product.price)}</p>
          <div className="mt-5 grid gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              <MessageCircle className="size-4" />
              WhatsApp seller
            </a>
            <Button variant="secondary" onClick={() => toggleWishlist(product.id)} icon={<Bookmark className={saved ? 'size-4 fill-current' : 'size-4'} />}>
              {saved ? 'Saved' : 'Save listing'}
            </Button>
            <Button variant="secondary" onClick={() => void shareProduct(product)} icon={<Share2 className="size-4" />}>
              Share
            </Button>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)] dark:bg-slate-950 md:panel md:p-6">
          <div className="flex items-center gap-4">
            <img src={product.sellerAvatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'} alt="" className="size-14 rounded-2xl object-cover" />
            <div>
              <p className="inter-copy font-medium">{product.sellerName}</p>
              <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-500">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                4.9 seller rating
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#5b2ee5]/10 p-4 text-sm font-semibold text-[#5b2ee5] dark:text-violet-300">
            <ShieldCheck className="size-5" />
            Identity and payment signals verified
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-[84px] z-30 mx-auto max-w-[480px] px-4 md:hidden">
        <div className="grid grid-cols-[1fr_1fr_52px] gap-2 rounded-[24px] bg-white/95 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.2)] backdrop-blur dark:bg-slate-950/95">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition active:scale-[0.98]"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
          <Button variant="secondary" onClick={() => toggleWishlist(product.id)} icon={<Bookmark className={saved ? 'size-4 fill-current' : 'size-4'} />}>
            Save
          </Button>
          <Button variant="secondary" className="px-0" aria-label="Share" onClick={() => void shareProduct(product)} icon={<Share2 className="size-4" />} />
        </div>
      </div>
    </div>
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

function buildWhatsappUrl(product: Product) {
  const message = `Hi ${product.sellerName}, I am interested in "${product.title}" listed for ${formatPrice(product.price)} in ${product.location}. Is it still available?`;
  return `https://wa.me/${fallbackWhatsappNumber}?text=${encodeURIComponent(message)}`;
}


