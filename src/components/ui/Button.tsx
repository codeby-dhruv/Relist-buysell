import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
}

export function Button({ className, variant = 'primary', icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' && 'bg-ink text-white shadow-glow hover:bg-slate-800 dark:bg-white dark:text-ink',
        variant === 'secondary' && 'border border-slate-200 bg-white text-ink hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white',
        variant === 'ghost' && 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10',
        variant === 'danger' && 'bg-rose-600 text-white hover:bg-rose-700',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
