import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
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
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
        <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-end md:p-6">
          <div>
            <p className="text-xs font-normal text-slate-500">Category directory</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">{t.allCategories}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Pick a section and go straight to the listings that match what you want to buy, rent, or book.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:w-72">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
              <p className="text-2xl font-semibold">{categories.length}</p>
              <p className="mt-1 text-xs font-normal text-slate-500">sections</p>
            </div>
            <Link to="/sell" className="group rounded-2xl bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600 p-4 text-white">
              <span className="block text-sm font-medium">List an item</span>
              <ArrowRight className="mt-3 size-5 transition group-hover:translate-x-0.5" />
            </Link>
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
          <a key={group} href={`#${group}`} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium dark:border-white/10 dark:bg-slate-950">
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
                <h2 className="text-xl font-semibold">{label}</h2>
                <p className="text-xs font-normal text-slate-500">{items.length} categories available</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/?category=${item.id}`}
                  className="group rounded-[24px] border border-slate-100 bg-white p-3 text-center shadow-sm transition active:scale-[0.98] dark:border-white/10 dark:bg-slate-950 md:hover:-translate-y-1 md:hover:shadow-soft"
                >
                  <span className="market-ring mx-auto grid size-16 place-items-center rounded-full">
                    <span className="grid size-full place-items-center rounded-full bg-white dark:bg-black">
                      <item.icon className="size-6 text-[#0f0f12] dark:text-white" />
                    </span>
                  </span>
                  <span className="mt-3 block text-xs font-medium leading-tight">{item.label}</span>
                  <span className="mt-1 block text-[10px] font-normal text-slate-400">{item.group}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}


