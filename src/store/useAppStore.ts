import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  language: 'en' | 'hi' | 'gu';
  wishlist: string[];
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'hi' | 'gu') => void;
  toggleWishlist: (productId: string) => void;
  setWishlist: (wishlist: string[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      wishlist: [],
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },
      setLanguage: (language) => set({ language }),
      toggleWishlist: (productId) => {
        set((state) => {
          const wishlist = state.wishlist.includes(productId)
            ? state.wishlist.filter((item) => item !== productId)
            : [...state.wishlist, productId];

          // Sync to Firestore (best-effort). Use dynamic ESM import to avoid CommonJS `require()` in Vite.
          void import('./useAuthStore')
            .then(({ useAuthStore }) => {
              const { user } = useAuthStore.getState();
              if (!user) return;
              return import('@/services/authService').then(({ updateProfileData }) =>
                updateProfileData(user.uid, { savedProducts: wishlist }).catch(console.error)
              );
            })
            .catch(() => undefined);
          return { wishlist };
        });
      },
      setWishlist: (wishlist) => set({ wishlist })
    }),
    {
      name: 'relist-app',
      onRehydrateStorage: () => (state) => {
        if (state?.theme === 'dark') document.documentElement.classList.add('dark');
      }
    }
  )
);
