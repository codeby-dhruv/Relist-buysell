import { Search, SlidersHorizontal } from 'lucide-react';
import { categories } from '@constants/categories';
import type { ProductCategory } from '@/types/models';

interface ProductFiltersProps {
  search: string;
  category: ProductCategory | 'all';
  sort: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  onSearch: (value: string) => void;
  onCategory: (value: ProductCategory | 'all') => void;
  onSort: (value: 'newest' | 'price-asc' | 'price-desc' | 'popular') => void;
}

export function ProductFilters({ search, category, sort, onSearch, onCategory, onSort }: ProductFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-950">
          <Search className="size-5 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="Search iPhone, sofa, bike..."
          />
        </label>
        <label className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-950">
          <SlidersHorizontal className="size-5 text-slate-400" />
          <select
            value={sort}
            onChange={(event) => onSort(event.target.value as ProductFiltersProps['sort'])}
            className="w-full bg-transparent text-sm font-semibold outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="popular">Most popular</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${category === 'all' ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-white text-slate-600 dark:bg-white/10 dark:text-slate-300'}`}
          onClick={() => onCategory('all')}
        >
          All
        </button>
        {categories.map((item) => (
          <button
            key={item.id}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${category === item.id ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-white text-slate-600 dark:bg-white/10 dark:text-slate-300'}`}
            onClick={() => onCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
