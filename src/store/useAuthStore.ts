import { create } from 'zustand';
import { User } from 'firebase/auth';
import { useAppStore } from './useAppStore';

interface UserProfile {
  displayName: string;
  email: string;
  mobile: string;
  profilePic?: string;
  rating?: number;
  totalSales?: number;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  fetchProfile: (uid: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => {
    set({ user });
    if (!user) useAppStore.getState().setWishlist([]);
  },
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  fetchProfile: async (uid: string) => {
    try {
      const { db } = await import('@/firebase/config');
      const { doc, getDoc } = await import('firebase/firestore');
      if (!db) return;
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        set({ profile: data });
        if (data.savedProducts) useAppStore.getState().setWishlist(data.savedProducts);
      } else {
        set({ profile: null });
        useAppStore.getState().setWishlist([]);
      }
    } catch (err) {
      console.error('Error in fetchProfile', err);
    }
  }
}));
