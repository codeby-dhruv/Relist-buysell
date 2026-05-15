import { useMemo, useState } from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories } from '@constants/categories';
import { copy } from '@constants/languages';
import { useAppStore } from '@store/useAppStore';

const groupLabels = {
  market: 'Marketplace',
  mobility: 'Vehicles',
  property: 'Property',
  services: 'Services'
};

export function CategoriesPage() {
  const [search, setSearch] = useState('');
  const language = useAppStore((state) => state.language);
  const t = copy[language];
  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    return categories.filter((category) => (value ? `${category.label} ${category.group}`.toLowerCase().includes(value) : true));
  }, [search]);

  return (
    <div className="space-y-5 px-4 pt-4 md:px-0 md:pt-0">
      <section className="overflow-hidden rounded-[30px] bg-white shadow-sm dark:bg-black md:border md:border-slate-200 md:bg-white md:p-6 md:dark:border-white/10 md:dark:bg-slate-950">
        <div className="relative rounded-[28px] bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] p-5 text-white md:p-7">
          <div className="absolute -right-16 -top-20 size-52 rounded-full border-[28px] border-white/15" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white/75">
                <Sparkles className="size-4" /> Discover
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">{t.allCategories}</h1>
              <p className="mt-2 max-w-xl text-sm font-semibold text-white/78 md:text-base">
                Products, vehicles, services, rentals, property, jobs and local experts in one place.
              </p>
            </div>
            <div className="hidden rounded-3xl bg-white/16 p-4 text-center backdrop-blur md:block">
              <TrendingUp className="mx-auto size-6" />
              <p className="mt-3 text-2xl font-black">{categories.length}+</p>
              <p className="text-xs font-bold text-white/70">verticals</p>
            </div>
          </div>
        </div>
      </section>

      <label className="sticky top-[73px] z-20 flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/95 md:top-20">
        <Search className="size-5 text-slate-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
          placeholder={t.searchCategories}
        />
      </label>

      <section className="flex gap-3 overflow-x-auto pb-1">
        {Object.entries(groupLabels).map(([group, label]) => (
          <a key={group} href={`#${group}`} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold dark:border-white/10 dark:bg-slate-950">
            {label}
          </a>
        ))}
      </section>

      {Object.entries(groupLabels).map(([group, label]) => {
        const items = filtered.filter((category) => category.group === group);
        if (!items.length) return null;

        return (
          <section id={group} key={group} className="space-y-3 scroll-mt-32">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight">{label}</h2>
                <p className="text-xs font-semibold text-slate-500">{items.length} categories available</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/?category=${item.id}`}
                  className="group rounded-[24px] border border-slate-100 bg-white p-3 text-center shadow-sm transition active:scale-[0.98] dark:border-white/10 dark:bg-slate-950 md:hover:-translate-y-1 md:hover:shadow-soft"
                >
                  <span className="insta-ring mx-auto grid size-16 place-items-center rounded-full">
                    <span className="grid size-full place-items-center rounded-full bg-white dark:bg-black">
                      <item.icon className="size-6 text-[#0f0f12] dark:text-white" />
                    </span>
                  </span>
                  <span className="mt-3 block text-xs font-black leading-tight">{item.label}</span>
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{item.group}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
