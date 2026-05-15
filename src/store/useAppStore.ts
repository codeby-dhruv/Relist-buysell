import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  language: 'en' | 'hi' | 'gu';
  wishlist: string[];
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'hi' | 'gu') => void;
  toggleWishlist: (productId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      wishlist: ['p1', 'p5'],
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },
      setLanguage: (language) => set({ language }),
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((item) => item !== productId)
            : [...state.wishlist, productId]
        }))
    }),
    {
      name: 'relist-app',
      onRehydrateStorage: () => (state) => {
        if (state?.theme === 'dark') document.documentElement.classList.add('dark');
      }
    }
  )
);
