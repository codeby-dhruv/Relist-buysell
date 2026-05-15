import type { ReactNode } from 'react';

export function EmptyState({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="grid min-h-72 place-items-center rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-8 text-center dark:border-white/10 dark:bg-white/5">
      <div>
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-teal-500/10 text-teal-600">{icon}</div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{body}</p>
      </div>
    </div>
  );
}
