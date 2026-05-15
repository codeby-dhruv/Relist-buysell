import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronLeft, Grid3X3, Heart, Home, Moon, Plus, Search, Sun, User } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { useAppStore } from '@store/useAppStore';
import { cn } from '@utils/cn';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/categories', label: 'Categories', icon: Grid3X3 },
  { to: '/wishlist', label: 'Saved', icon: Heart },
  { to: '/dashboard', label: 'Profile', icon: User }
];

export function AppLayout() {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const location = useLocation();
  const showCompactMobileTopBar = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-white text-[#0f0f12] dark:bg-black dark:text-white md:bg-[#fafafa] md:dark:bg-[#0f0f12]">
      <header className="sticky top-0 z-40 hidden border-b border-white/70 bg-white/78 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/75 md:block">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 font-extrabold">
            <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600 text-white shadow-sm">R</span>
            <span className="hidden text-xl sm:block">Relist</span>
          </Link>
          <div className="hidden flex-1 justify-center px-8 md:flex">
            <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/10">
              <Search className="size-4" />
              Search products, sellers, and neighborhoods
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="size-11 rounded-full p-0"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              icon={theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
            />
            <Link to="/sell" className="hidden md:block">
              <Button icon={<Plus className="size-4" />}>Sell item</Button>
            </Link>
            <Link to="/auth" className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white dark:border-white/10 dark:bg-white/10">
              <User className="size-5" />
            </Link>
          </div>
        </div>
      </header>

      {showCompactMobileTopBar && <MobileTopBar />}

      <div className="mx-auto grid max-w-7xl gap-8 pb-24 md:grid-cols-[220px_1fr] md:px-6 md:pb-10 md:pt-5 lg:px-8">
        <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] md:block">
          <nav className="glass space-y-2 rounded-[28px] p-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition dark:text-slate-300', isActive && 'bg-[#0f0f12] text-white shadow-sm dark:bg-white dark:text-black')
                }
              >
                <item.icon className="size-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-slate-200/80 bg-white/96 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-2xl dark:border-white/10 dark:bg-black/96 md:hidden">
        <div className="grid grid-cols-5 items-center gap-1">
          {navItems.slice(0, 2).map((item) => (
            <MobileNavItem key={item.to} {...item} />
          ))}
          <Link to="/sell" className="mx-auto -mt-7 grid size-16 place-items-center rounded-full border-[7px] border-white bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600 text-white shadow-[0_14px_30px_rgba(14,165,233,0.24)] dark:border-black">
            <Plus className="size-6" />
          </Link>
          {navItems.slice(2).map((item) => (
            <MobileNavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function MobileTopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const titles: Record<string, string> = {
    '/wishlist': 'Explore',
    '/categories': 'Categories',
    '/dashboard': 'Profile',
    '/sell': 'Sell Item',
    '/auth': 'Account'
  };
  const title = location.pathname.startsWith('/products') ? 'Product Details' : (titles[location.pathname] ?? 'Relist');

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/96 px-4 pb-3 pt-3 text-[#0f0f12] backdrop-blur-2xl dark:border-white/10 dark:bg-black/96 dark:text-white md:hidden">
      <div className="relative flex items-center justify-between">
        <button onClick={() => (history.length > 1 ? navigate(-1) : navigate('/'))} className="grid size-11 place-items-center rounded-full bg-slate-100 dark:bg-white/10">
          <ChevronLeft className="size-5" />
        </button>
        <div className="text-center">
          <p className="text-[11px] font-normal text-slate-400">Relist super app</p>
          <h1 className="text-lg font-extrabold leading-tight">{title}</h1>
        </div>
        <button className="relative grid size-11 place-items-center rounded-full bg-slate-100 dark:bg-white/10">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-sky-500" />
        </button>
      </div>
    </header>
  );
}

function MobileNavItem({ to, label, icon: Icon }: (typeof navItems)[number]) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn('grid place-items-center gap-1 rounded-2xl py-2 text-[11px] font-normal text-slate-400', isActive && 'text-[#0f0f12] dark:text-white')
      }
    >
      <Icon className="size-5" />
      <span>{label}</span>
    </NavLink>
  );
}


