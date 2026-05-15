import { Bookmark, Edit3, Grid3X3, Mail, MapPin, MoreHorizontal, Phone, Settings, ShieldCheck, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { languages } from '@constants/languages';
import { demoUser, products } from '@services/mockData';
import { useAppStore } from '@store/useAppStore';
import { formatPrice } from '@utils/format';

export function DashboardPage() {
  const listedProducts = products.slice(0, 6);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  return (
    <div className="bg-white px-4 pt-4 dark:bg-black md:rounded-[32px] md:border md:border-slate-200 md:bg-white md:p-6 md:shadow-sm md:dark:border-white/10 md:dark:bg-slate-950">
      <section className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight">{demoUser.displayName.toLowerCase().replace(/\s+/g, '.')}</h1>
        <div className="flex items-center gap-4">
          <Settings className="size-6" />
          <MoreHorizontal className="size-6" />
        </div>
      </section>

      <section className="mt-5 grid grid-cols-[94px_1fr] items-center gap-5">
        <div className="insta-ring rounded-full">
          <img src={demoUser.avatarUrl} alt={demoUser.displayName} className="size-[90px] rounded-full border-4 border-white object-cover dark:border-black" />
        </div>
        <div className="grid grid-cols-3 text-center">
          <Stat value="38" label="Posts" />
          <Stat value="2.8k" label="Views" />
          <Stat value="4.9" label="Rating" />
        </div>
      </section>

      <section className="mt-4 space-y-2">
        <div>
          <h2 className="text-sm font-black">{demoUser.displayName}</h2>
          <p className="text-sm leading-5 text-slate-700 dark:text-slate-300">
            Verified seller. Premium gadgets, furniture, vehicles and local deals. Fast replies, clean handovers.
          </p>
        </div>
        <p className="flex items-center gap-1 text-sm font-semibold text-slate-500">
          <MapPin className="size-4" /> {demoUser.location}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-600">KYC verified</span>
          <span className="rounded-full bg-[#d62976]/10 px-3 py-1 text-xs font-black text-[#d62976]">Top seller</span>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="secondary" icon={<Edit3 className="size-4" />}>
          Edit profile
        </Button>
        <Link to="/sell">
          <Button variant="secondary" className="w-full">
            Add listing
          </Button>
        </Link>
      </section>

      <section className="mt-5 grid gap-3 rounded-3xl bg-slate-50 p-4 dark:bg-white/5 md:grid-cols-2">
        <InfoLine icon={<Mail className="size-4" />} label="Email" value={demoUser.email} />
        <InfoLine icon={<Phone className="size-4" />} label="Phone" value="+91 98765 43210" />
        <InfoLine icon={<ShieldCheck className="size-4" />} label="Trust" value="Identity verified" />
        <label className="flex items-center gap-3 rounded-2xl bg-white p-3 dark:bg-black">
          <span className="grid size-9 place-items-center rounded-xl bg-slate-100 dark:bg-white/10">A</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Language</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} className="w-full bg-transparent text-sm font-black outline-none">
              {languages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </span>
        </label>
      </section>

      <section className="mt-6 border-t border-slate-200 dark:border-white/10">
        <div className="grid grid-cols-2">
          <button className="flex items-center justify-center gap-2 border-t-2 border-black py-3 text-xs font-black uppercase tracking-[0.16em] dark:border-white">
            <Grid3X3 className="size-4" /> Listings
          </button>
          <button className="flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            <Bookmark className="size-4" /> Saved
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {listedProducts.map((product) => (
            <article key={product.id} className="group relative overflow-hidden bg-slate-100 dark:bg-white/5">
              <Link to={`/products/${product.id}`} className="block aspect-[4/5]">
                <img src={product.imageUrls[0]} alt={product.title} className="h-full w-full object-cover transition md:group-hover:scale-105" />
              </Link>
              <div className="absolute inset-x-1 bottom-1 rounded-xl bg-black/55 p-1.5 text-white opacity-100 backdrop-blur md:opacity-0 md:transition md:group-hover:opacity-100">
                <p className="truncate text-[10px] font-black">{formatPrice(product.price)}</p>
                <div className="mt-1 flex gap-1">
                  <button className="grid h-7 flex-1 place-items-center rounded-lg bg-white/18">
                    <Edit3 className="size-3.5" />
                  </button>
                  <button className="grid h-7 flex-1 place-items-center rounded-lg bg-[#ed4956]">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-lg font-black">{value}</p>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function InfoLine({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 dark:bg-black">
      <span className="grid size-9 place-items-center rounded-xl bg-slate-100 dark:bg-white/10">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</span>
        <span className="block truncate text-sm font-black">{value}</span>
      </span>
    </div>
  );
}
