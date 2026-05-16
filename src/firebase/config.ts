import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAmhDZao3rILuuYanN29zNXjgstuLg0VS0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "relist-buy-sell.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "relist-buy-sell",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "relist-buy-sell.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "324450332634",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:324450332634:web:17e5286d43200fd5dc9ae3"
};

export const firebaseEnabled = true;

export const firebaseApp = firebaseEnabled ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) : null;
export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const storage = firebaseApp ? getStorage(firebaseApp) : null;
export const googleProvider = new GoogleAuthProvider();
