import { useState } from 'react';
import type { FormEvent, InputHTMLAttributes, ReactNode } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, Star, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { copy } from '@constants/languages';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '@services/authService';
import { useAppStore } from '@store/useAppStore';
import { useAuthStore } from '@store/useAuthStore';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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

  async function handleGoogle() {
    setGoogleLoading(true);
    setErrorMsg(null);
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
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      
      {/* LEFT PANEL — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 via-sky-600/10 to-indigo-600/20" />
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
        
        {/* Logo */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <img src="/Tlogo.png" alt="Relist" className="h-10 w-10 object-contain" />
            <span className="text-xl font-extrabold text-white tracking-tight">Relist</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div>
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Buy &amp; Sell<br />
              <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
                Anything.
              </span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">
              India's trusted marketplace for pre-owned goods. Fast, safe, and easy.
            </p>
          </div>

          {/* Feature pills */}
          <div className="space-y-3">
            {[
              { icon: <Shield className="size-4" />, label: '100% Verified Listings', color: 'text-teal-400' },
              { icon: <Zap className="size-4" />, label: 'Instant Chat with Sellers', color: 'text-sky-400' },
              { icon: <Star className="size-4" />, label: '5 Million+ Happy Users', color: 'text-indigo-400' },
            ].map(({ icon, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`${color}`}>{icon}</div>
                <span className="text-sm font-medium text-slate-300">{label}</span>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map((_, i) => (
              <div key={i} className="size-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border-2 border-slate-800 -ml-2 first:ml-0 overflow-hidden flex items-center justify-center">
                <User className="size-4 text-slate-400" />
              </div>
            ))}
            <span className="ml-2 text-xs text-slate-400 font-medium">Join 5M+ users today</span>
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative">
          <p className="text-xs text-slate-600">© 2025 Relist · Made with ♥ in India</p>
        </div>
      </div>

      {/* RIGHT PANEL — Auth Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/Tlogo.png" alt="Relist" className="h-10 w-10 object-contain" />
            <span className="text-xl font-extrabold text-white">Relist</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/10">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-white">
              {mode === 'login' ? 'Welcome back 👋' : 'Join Relist today 🎉'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {mode === 'login' ? 'Sign in to continue to your account' : 'Create your free account in seconds'}
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="mb-5 p-3 text-sm font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
              {errorMsg}
            </div>
          )}

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-95 disabled:opacity-50"
            >
              {/* Google SVG icon */}
              <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              disabled
              className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/50 cursor-not-allowed"
            >
              {/* Facebook SVG icon */}
              <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-white/10" />
            <span className="mx-4 text-xs font-medium text-slate-500 uppercase tracking-widest">or continue with email</span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <AuthField icon={<User className="size-4" />} name="name" placeholder="Full Name" autoComplete="name" />
                <AuthField icon={<Phone className="size-4" />} name="mobile" type="tel" placeholder="Mobile Number" autoComplete="tel" />
              </>
            )}
            <AuthField icon={<Mail className="size-4" />} name="email" type="email" placeholder="Email Address" autoComplete="email" />
            <div className="relative">
              <AuthField
                icon={<Lock className="size-4" />}
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs text-teal-400 hover:text-teal-300 font-medium transition">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-500/20 transition hover:opacity-90 active:scale-95 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <><div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Please wait...</>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Bottom note */}
          <p className="mt-6 text-center text-xs text-slate-600">
            By continuing, you agree to our{' '}
            <span className="text-teal-400 hover:underline cursor-pointer">Terms</span> and{' '}
            <span className="text-teal-400 hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

function AuthField({ icon, ...props }: InputHTMLAttributes<HTMLInputElement> & { icon: ReactNode }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition focus-within:border-teal-500/60 focus-within:bg-white/8">
      <span className="text-slate-500 shrink-0">{icon}</span>
      <input
        required
        className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
        {...props}
      />
    </label>
  );
}
