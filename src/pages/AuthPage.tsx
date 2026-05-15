import { useState } from 'react';
import type { FormEvent, InputHTMLAttributes, ReactNode } from 'react';
import { Mail, Lock, User, Chrome } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '@services/authService';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      if (mode === 'register') {
        await registerWithEmail(String(form.get('name')), String(form.get('email')), String(form.get('password')));
      } else {
        await loginWithEmail(String(form.get('email')), String(form.get('password')));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-soft dark:bg-slate-950 lg:grid-cols-2">
      <section className="hidden bg-ink p-10 text-white dark:bg-white dark:text-ink lg:block">
        <h1 className="text-4xl font-extrabold tracking-tight">Your trusted local marketplace account.</h1>
        <p className="mt-4 leading-7 text-white/68 dark:text-slate-600">Save listings, message sellers, manage inventory, and build a reputation buyers can trust.</p>
      </section>
      <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-10">
        <div>
          <h2 className="text-3xl font-extrabold">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <p className="mt-2 text-sm text-slate-500">Firebase email/password and Google auth are wired in.</p>
        </div>
        {mode === 'register' && (
          <Field icon={<User className="size-5" />} name="name" placeholder="Full name" />
        )}
        <Field icon={<Mail className="size-5" />} name="email" type="email" placeholder="Email address" />
        <Field icon={<Lock className="size-5" />} name="password" type="password" placeholder="Password" />
        <Button className="w-full" disabled={loading}>
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </Button>
        <Button type="button" variant="secondary" className="w-full" onClick={() => void loginWithGoogle()} icon={<Chrome className="size-4" />}>
          Continue with Google
        </Button>
        <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="w-full text-sm font-bold text-teal-600">
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
        </button>
      </form>
    </div>
  );
}

function Field({ icon, ...props }: InputHTMLAttributes<HTMLInputElement> & { icon: ReactNode }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <span className="text-slate-400">{icon}</span>
      <input required className="min-w-0 flex-1 bg-transparent text-sm outline-none" {...props} />
    </label>
  );
}
