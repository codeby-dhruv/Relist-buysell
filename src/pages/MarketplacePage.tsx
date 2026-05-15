import { useEffect, useState } from 'react';
import { Bell, Bookmark, Camera, Heart, MapPin, MessageCircle, MoreHorizontal, PlusSquare, Search, Send } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductGrid } from '@components/product/ProductGrid';
import { ProductFilters } from '@features/products/ProductFilters';
import { categories } from '@constants/categories';
import { useProducts } from '@hooks/useProducts';
import { useAppStore } from '@store/useAppStore';
import { formatPrice } from '@utils/format';
import type { Product, ProductCategory } from '@/types/models';

export function MarketplacePage() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [sort, setSort] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const { data, isLoading } = useProducts({ search, category, sort });

  useEffect(() => {
    const selected = params.get('category') as ProductCategory | null;
    if (selected) setCategory(selected);
  }, [params]);

  return (
    <div className="bg-white dark:bg-black md:bg-transparent md:dark:bg-transparent">
      <section className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/96 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-black/96 md:hidden">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-[28px] font-black">
            Relist
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/sell" aria-label="Create listing">
              <PlusSquare className="size-6" />
            </Link>
            <button aria-label="Notifications">
              <Bell className="size-6" />
            </button>
          </div>
        </div>
        <label className="mt-3 flex h-11 items-center gap-3 rounded-xl bg-slate-100 px-4 dark:bg-white/10">
          <Search className="size-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            placeholder="Search marketplace"
          />
        </label>
      </section>

      <section className="border-b border-slate-100 bg-white py-3 dark:border-white/10 dark:bg-black md:hidden">
        <div className="flex gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          <Link to="/categories" className="w-[72px] shrink-0 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600 p-[2px]">
              <span className="grid size-full place-items-center rounded-full bg-white dark:bg-black">
                <Camera className="size-6" />
              </span>
            </span>
            <span className="mt-1 block truncate text-xs font-normal">View all</span>
          </Link>
          {categories.slice(0, 16).map((item) => (
            <button key={item.id} onClick={() => setCategory(item.id)} className="w-[72px] shrink-0 text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600 p-[2px]">
                <span className="grid size-full place-items-center rounded-full bg-white dark:bg-black">
                  <item.icon className="size-6" />
                </span>
              </span>
              <span className="mt-1 block truncate text-xs font-normal">{item.label}</span>
            </button>
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
              <InstagramListing key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <div className="hidden space-y-6 md:block">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-950">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-extrabold text-sky-600">National super app</p>
              <h1 className="inter-copy mt-2 text-4xl font-semibold">Marketplace feed for everything local.</h1>
              <p className="mt-3 max-w-2xl text-slate-500">Products, vehicles, property, rentals, services, jobs, and local professionals in one clean discovery experience.</p>
            </div>
            <Link to="/categories" className="rounded-2xl bg-[#0f0f12] px-5 py-3 text-sm font-extrabold text-white dark:bg-white dark:text-black">
              View all categories
            </Link>
          </div>
        </section>

        <section className="flex gap-4 overflow-x-auto rounded-[28px] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950">
          {categories.map((item) => (
            <button key={item.id} onClick={() => setCategory(item.id)} className="w-24 shrink-0 text-center">
              <span className={`mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-tr ${item.accent} text-white`}>
                <item.icon className="size-7" />
              </span>
              <span className="mt-2 block truncate text-xs font-normal">{item.label}</span>
            </button>
          ))}
        </section>

        <ProductFilters search={search} category={category} sort={sort} onSearch={setSearch} onCategory={setCategory} onSort={setSort} />
        <ProductGrid products={data} loading={isLoading} />
      </div>
    </div>
  );
}

function InstagramListing({ product }: { product: Product }) {
  const wishlist = useAppStore((state) => state.wishlist);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const saved = wishlist.includes(product.id);

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
        <MoreHorizontal className="size-6" />
      </div>

      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-[4/5] bg-slate-100 dark:bg-white/5">
          <img src={product.imageUrls[0]} alt={product.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
      </Link>

      <div className="space-y-2 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => toggleWishlist(product.id)} aria-label="Save listing">
              <Heart className={saved ? 'size-6 fill-[#ed4956] text-[#ed4956]' : 'size-6'} />
            </button>
            <button aria-label="Message seller">
              <MessageCircle className="size-6" />
            </button>
            <button aria-label="Share listing">
              <Send className="size-6" />
            </button>
          </div>
          <Bookmark className={saved ? 'size-6 fill-current' : 'size-6'} />
        </div>
        <p className="inter-copy text-sm font-medium">{product.saves.toLocaleString()} saves</p>
        <p className="text-sm">
          <Link to={`/products/${product.id}`} className="inter-copy font-medium">
            {product.title}
          </Link>{' '}
              <span className="inter-copy font-semibold text-sky-600">{formatPrice(product.price)}</span>
        </p>
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{product.description}</p>
        <p className="text-xs font-normal text-slate-400">{product.category}</p>
      </div>
    </article>
  );
}


