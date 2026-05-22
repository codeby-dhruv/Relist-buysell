import { Bookmark, Edit3, Grid3X3, Mail, MapPin, Phone, Plus, Settings, ShieldCheck, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { copy, languages } from '@constants/languages';
import { demoUser, products } from '@services/mockData';
import { getProductsByUser } from '@services/productService';
import { useAppStore } from '@store/useAppStore';
import { useAuthStore } from '@store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '@utils/format';

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const wishlist = useAppStore((state) => state.wishlist);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);

  const { data: myProducts = [] } = useQuery({
    queryKey: ['products-by-user', user?.uid],
    queryFn: () => getProductsByUser(user!.uid),
    enabled: Boolean(user?.uid)
  });

  const listedProducts = (user ? myProducts : products).slice(0, 6);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const t = copy[language];

  const sellerStats = [
    { value: '38', label: t.activeListings },
    { value: '2.8k', label: t.profileViews },
    { value: '4.9', label: t.rating }
  ];

  return (
    <div className="space-y-5 px-4 pt-4 md:px-0 md:pt-0">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
        <div className="bg-gradient-to-br from-teal-600 via-sky-600 to-indigo-700 px-5 py-6 text-white md:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="rounded-[24px] bg-white/18 p-1 backdrop-blur">
                <img src={demoUser.avatarUrl} alt={demoUser.displayName} className="size-20 rounded-[20px] object-cover ring-4 ring-white/90" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-normal text-white/70">{t.sellerProfile}</p>
                <h1 className="inter-copy mt-1 truncate text-2xl font-semibold">{demoUser.displayName}</h1>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-white/80">
                  <MapPin className="size-4" /> {demoUser.location}
                </p>
              </div>
            </div>
            <Button variant="secondary" className="shrink-0 bg-white/15 text-white hover:bg-white/20" icon={<Settings className="size-4" />}>
              {t.settings}
            </Button>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {sellerStats.map((item) => (
              <Stat key={item.label} {...item} />
            ))}
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {t.verifiedSeller}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-normal text-emerald-700 dark:text-emerald-300">{t.kycVerified}</span>
              <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-normal text-sky-700 dark:text-sky-300">{t.topSeller}</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant="secondary" icon={<Edit3 className="size-4" />}>
              {t.editProfile}
            </Button>
            <Link to="/sell">
              <Button className="w-full bg-slate-950 text-white dark:bg-white dark:text-slate-950" icon={<Plus className="size-4" />}>
                {t.addListing}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950 md:grid-cols-2">
        <InfoLine icon={<Mail className="size-4" />} label={t.email} value={demoUser.email} />
        <InfoLine icon={<Phone className="size-4" />} label={t.phone} value="+91 98765 43210" />
        <InfoLine icon={<ShieldCheck className="size-4" />} label={t.trust} value={t.identityVerified} />
        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
          <span className="grid size-9 place-items-center rounded-xl bg-white text-sm font-bold dark:bg-slate-950">A</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-normal text-slate-400">{t.language}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} className="w-full bg-transparent text-sm font-bold outline-none">
              {languages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </span>
        </label>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 dark:border-white/10">
          <div>
            <p className="text-xs font-normal text-slate-400">{t.inventory}</p>
            <h2 className="inter-copy mt-1 text-lg font-semibold">{t.yourListings}</h2>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-normal dark:bg-white/10">
            <Grid3X3 className="size-4" /> {t.listings}
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/10">
          {listedProducts.map((product) => {
            const saved = wishlist.includes(product.id);
            return (
              <article key={product.id} className="grid grid-cols-[88px_1fr] gap-3 p-4 md:grid-cols-[104px_1fr_auto] md:items-center">
              <Link to={`/products/${product.id}`} className="block aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5">
                <img src={product.imageUrls[0]} alt={product.title} className="h-full w-full object-cover" />
              </Link>
              <div className="min-w-0">
                <Link to={`/products/${product.id}`} className="inter-copy line-clamp-1 font-medium">
                  {product.title}
                </Link>
                <p className="inter-copy mt-1 text-lg font-semibold">{formatPrice(product.price)}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-normal text-slate-500">
                  <span>{product.category}</span>
                  <span>{product.location}</span>
                  <span>{product.saves} {t.saves}</span>
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-3 gap-2 md:col-span-1 md:w-36">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="grid h-10 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                  aria-label={saved ? 'Remove saved listing' : 'Save listing'}
                >
                  <Bookmark className={saved ? 'size-4 fill-current' : 'size-4'} />
                </button>
                <button className="grid h-10 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300" aria-label="Edit listing">
                  <Edit3 className="size-4" />
                </button>
                <button className="grid h-10 place-items-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10" aria-label="Delete listing">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
      <p className="inter-copy text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs font-normal text-slate-500">{label}</p>
    </div>
  );
}

function InfoLine({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
      <span className="grid size-9 place-items-center rounded-xl bg-white dark:bg-slate-950">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[11px] font-normal text-slate-400">{label}</span>
        <span className="block truncate text-sm font-bold">{value}</span>
      </span>
    </div>
  );
}
