import { useState } from 'react';
import type { FormEvent, InputHTMLAttributes, ReactNode } from 'react';
import { Mail, Lock, User, Chrome, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { copy } from '@constants/languages';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '@services/authService';
import { useAppStore } from '@store/useAppStore';
import { useAuthStore } from '@store/useAuthStore';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { fetchProfile } = useAuthStore();
  const language = useAppStore((state) => state.language);
  const t = copy[language];
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const form = new FormData(event.currentTarget);
    try {
      let uid = '';
      if (mode === 'register') {
        const cred = await registerWithEmail(String(form.get('name')), String(form.get('email')), String(form.get('password')), String(form.get('mobile')));
        if (cred?.user) uid = cred.user.uid;
      } else {
        const cred = await loginWithEmail(String(form.get('email')), String(form.get('password')));
        if (cred?.user) uid = cred.user.uid;
      }
      if (uid) await fetchProfile(uid);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMsg('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already in use. Please log in.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('Email/Password login is not enabled in Firebase Console.');
      } else {
        setErrorMsg(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-soft dark:bg-slate-950 lg:grid-cols-2">
      <section className="hidden bg-ink p-10 text-white dark:bg-white dark:text-ink lg:block">
        <h1 className="text-4xl font-extrabold">{t.yourTrustedAccount}</h1>
        <p className="mt-4 leading-7 text-white/68 dark:text-slate-600">{t.authDesc}</p>
      </section>
      <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-10 flex flex-col justify-center">
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl mb-4">
          <button type="button" onClick={() => { setMode('login'); setErrorMsg(null); }} className={`flex-1 py-2 text-sm font-bold rounded-xl transition ${mode === 'login' ? 'bg-white text-black shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>Log in</button>
          <button type="button" onClick={() => { setMode('register'); setErrorMsg(null); }} className={`flex-1 py-2 text-sm font-bold rounded-xl transition ${mode === 'register' ? 'bg-white text-black shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>Register</button>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold">{mode === 'login' ? t.welcomeBack : t.createAccount}</h2>
          <p className="mt-2 text-sm text-slate-500">{t.authSubDesc}</p>
        </div>
        {errorMsg && (
          <div className="p-3 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl dark:bg-rose-500/10 dark:border-rose-500/20">
            {errorMsg}
          </div>
        )}
        {mode === 'register' && (
          <>
            <Field icon={<User className="size-5" />} name="name" placeholder={t.fullName || "Full Name"} />
            <Field icon={<Phone className="size-5" />} name="mobile" type="tel" placeholder={t.mobileNumber || "Mobile Number"} />
          </>
        )}
        <Field icon={<Mail className="size-5" />} name="email" type="email" placeholder={t.emailAddress} />
        <Field icon={<Lock className="size-5" />} name="password" type="password" placeholder={t.password} />
        <Button className="w-full bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600" disabled={loading}>
          {loading ? 'Please wait...' : (mode === 'login' ? t.signIn : t.createAccount)}
        </Button>
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
          <span className="mx-4 text-xs font-medium text-slate-400 uppercase tracking-widest">OR</span>
          <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
        </div>
        <Button type="button" variant="secondary" className="w-full" onClick={async () => {
          try {
            const cred = await loginWithGoogle();
            if (cred?.user) await fetchProfile(cred.user.uid);
            navigate('/', { replace: true });
          } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/operation-not-allowed') {
              setErrorMsg('Google login is not enabled in Firebase Console.');
            } else {
              setErrorMsg(err.message || 'Failed to login with Google.');
            }
          }
        }} icon={<Chrome className="size-4" />}>
          {t.continueWithGoogle}
        </Button>
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
