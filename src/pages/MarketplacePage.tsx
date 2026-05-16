import { useEffect, useState } from 'react';
import { Bell, Bookmark, MapPin, PlusSquare, Search, Share2, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductGrid } from '@components/product/ProductGrid';
import { ProductFilters } from '@features/products/ProductFilters';
import { categories } from '@constants/categories';
import { copy } from '@constants/languages';
import { useProducts } from '@hooks/useProducts';
import { useAppStore } from '@store/useAppStore';
import { formatPrice } from '@utils/format';
import type { Product, ProductCategory } from '@/types/models';

export function MarketplacePage() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [sort, setSort] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const { data, isLoading } = useProducts({ search, category, sort });
  const banners = ['/banner%201.png', '/banner2.png'];
  const suggestions = buildSuggestions(search, data ?? []);

  const language = useAppStore((state) => state.language);
  const t = copy[language];

  useEffect(() => {
    const selected = params.get('category') as ProductCategory | null;
    if (selected) setCategory(selected);
  }, [params]);

  useEffect(() => {
    const timer = window.setInterval(() => setBannerIndex((current) => (current + 1) % banners.length), 2000);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="bg-white dark:bg-black md:bg-transparent md:dark:bg-transparent">
      <section className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/96 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-black/96 md:hidden">
        <div className="flex items-center justify-between">
          <Link to="/" className="inter-copy text-[28px] font-semibold">
            Relist
          </Link>
          <div className="flex items-center gap-4">
            <button aria-label="Search marketplace" onClick={() => setSearchOpen(true)}>
              <Search className="size-6" />
            </button>
            <Link to="/sell" aria-label="Create listing">
              <PlusSquare className="size-6" />
            </Link>
            <button aria-label="Notifications">
              <Bell className="size-6" />
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-slate-950">
            <label className="flex h-11 items-center gap-3 rounded-xl bg-slate-100 px-4 dark:bg-white/10">
              <Search className="size-4 text-slate-400" />
              <input
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                placeholder={t.searchCategoryOrProduct}
              />
              <button aria-label="Close search" onClick={() => setSearchOpen(false)}>
                <X className="size-4 text-slate-400" />
              </button>
            </label>
            {search.trim() && (
              <div className="mt-2 grid gap-1">
                {suggestions.map((item) => (
                  <button key={`${item.type}-${item.label}`} onClick={() => handleSuggestion(item, setSearch, setCategory, setSearchOpen)} className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-white/10">
                    <span>{item.label}</span>
                    <span className="text-xs font-normal text-slate-400">{item.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="border-b border-slate-100 bg-white p-4 dark:border-white/10 dark:bg-black md:hidden">
        <div className="overflow-hidden rounded-2xl bg-slate-100">
          <img src={banners[bannerIndex]} alt="Marketplace offer" className="h-28 w-full object-cover transition" />
        </div>
        <div className="mt-2 flex justify-center gap-1">
          {banners.map((banner, index) => (
            <span key={banner} className={`h-1.5 rounded-full transition-all ${index === bannerIndex ? 'w-5 bg-slate-900 dark:bg-white' : 'w-1.5 bg-slate-300 dark:bg-white/30'}`} />
          ))}
        </div>
      </section>

      <section className="md:hidden">
        {isLoading ? (
          <div className="p-4">
            <ProductGrid loading />
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/10">
            {(data ?? []).map((product) => (
              <MobileListing key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <div className="hidden space-y-6 md:block">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-950">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inter-copy text-sm font-medium text-sky-600">{t.nationalSuperApp}</p>
              <h1 className="inter-copy mt-2 text-4xl font-semibold">{t.marketplaceFeedDesc}</h1>
              <p className="mt-3 max-w-2xl text-slate-500">{t.marketplaceSubDesc}</p>
            </div>
            <Link to="/categories" className="inter-copy rounded-2xl bg-[#0f0f12] px-5 py-3 text-sm font-medium text-white dark:bg-white dark:text-black">
              {t.viewAllCategories}
            </Link>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950">
          <img src={banners[bannerIndex]} alt="Marketplace offer" className="h-40 w-full rounded-3xl object-cover lg:h-48" />
          <div className="mt-3 flex justify-center gap-1">
            {banners.map((banner, index) => (
              <span key={banner} className={`h-1.5 rounded-full transition-all ${index === bannerIndex ? 'w-6 bg-slate-900 dark:bg-white' : 'w-1.5 bg-slate-300 dark:bg-white/30'}`} />
            ))}
          </div>
        </section>

        <ProductFilters search={search} category={category} sort={sort} onSearch={setSearch} onCategory={setCategory} onSort={setSort} />
        <ProductGrid products={data} loading={isLoading} />
      </div>
    </div>
  );
}

function MobileListing({ product }: { product: Product }) {
  const wishlist = useAppStore((state) => state.wishlist);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const language = useAppStore((state) => state.language);
  const t = copy[language];
  const saved = wishlist.includes(product.id);
  const [expanded, setExpanded] = useState(false);
  const isLong = product.description.length > 92;
  const description = expanded || !isLong ? product.description : `${product.description.slice(0, 92)}...`;

  return (
    <article className="bg-white dark:bg-black">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <img src={product.sellerAvatar ?? product.imageUrls[0]} alt="" className="size-10 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="inter-copy truncate text-sm font-medium">{product.sellerName}</p>
            <p className="flex items-center gap-1 truncate text-xs text-slate-500">
              <MapPin className="size-3" /> {product.location}
            </p>
          </div>
        </div>
        <button onClick={() => void shareProduct(product)} aria-label="Share listing">
          <Share2 className="size-5" />
        </button>
      </div>

      <Link to={`/products/${product.id}`} className="block">
        <div>
          {product.imageUrls.length >= 3 ? (
            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-white/5">
              {product.imageUrls.slice(0, 3).map((img, index) => (
                <div key={img} className="relative aspect-[4/5] overflow-hidden">
                  <img src={img} alt={`${product.title} ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-white/5">
              <div className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth">
                {product.imageUrls.map((imageUrl, index) => (
                  <img key={imageUrl} src={imageUrl} alt={`${product.title} ${index + 1}`} className="h-full w-full shrink-0 snap-center object-cover" loading="lazy" />
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-2 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => toggleWishlist(product.id)} aria-label={saved ? 'Remove saved listing' : 'Save listing'}>
              <Bookmark className={saved ? 'size-6 fill-current' : 'size-6'} />
            </button>
            <button onClick={() => void shareProduct(product)} aria-label="Share listing">
              <Share2 className="size-6" />
            </button>
          </div>
        </div>
        <p className="inter-copy text-sm font-medium">{product.saves.toLocaleString()} {t.saves}</p>
        <p className="text-sm">
          <Link to={`/products/${product.id}`} className="inter-copy font-medium">
            {product.title}
          </Link>{' '}
              <span className="inter-copy font-semibold text-sky-600">{formatPrice(product.price)}</span>
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {description}
          {isLong && (
            <button className="ml-1 font-medium text-slate-900 dark:text-white" onClick={() => setExpanded((value) => !value)}>
              {expanded ? t.showLess : t.readMore}
            </button>
          )}
        </p>
        <p className="text-xs font-normal text-slate-400">{product.category}</p>
      </div>
    </article>
  );
}

type Suggestion = { type: 'category' | 'product'; label: string; category?: ProductCategory };

function buildSuggestions(value: string, products: Product[]): Suggestion[] {
  const query = value.trim().toLowerCase();
  if (!query) return [];
  const categoryItems = categories
    .filter((item) => item.label.toLowerCase().includes(query))
    .slice(0, 4)
    .map((item) => ({ type: 'category' as const, label: item.label, category: item.id }));
  const productItems = products
    .filter((product) => product.title.toLowerCase().includes(query) || product.category.toLowerCase().includes(query))
    .slice(0, 4)
    .map((product) => ({ type: 'product' as const, label: product.title }));
  return [...categoryItems, ...productItems].slice(0, 6);
}

function handleSuggestion(
  item: Suggestion,
  setSearch: (value: string) => void,
  setCategory: (value: ProductCategory | 'all') => void,
  setSearchOpen: (value: boolean) => void
) {
  setSearch(item.label);
  if (item.category) setCategory(item.category);
  setSearchOpen(false);
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


