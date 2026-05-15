import { cn } from '@utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10', className)} />;
}
