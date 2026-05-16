import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/firebase/config';

export function subscribeToAuth(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, callback);
}

export async function loginWithEmail(email: string, password: string) {
  if (!auth) return Promise.resolve({ user: null });
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(name: string, email: string, password: string, mobile: string) {
  if (!auth || !db) return Promise.resolve({ user: null });
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await setDoc(doc(db, 'users', credential.user.uid), {
    displayName: name,
    email,
    mobile,
    rating: 0,
    totalSales: 0,
    createdAt: new Date().toISOString()
  });
  return credential;
}

export async function loginWithGoogle() {
  if (!auth) return Promise.resolve({ user: null });
  return signInWithPopup(auth, googleProvider);
}

export async function logout() {
  if (!auth) return Promise.resolve();
  return signOut(auth);
}

export async function updateProfileData(uid: string, data: Partial<{ displayName: string; mobile: string; profilePic: string }>) {
  if (!db) return Promise.resolve();
  return setDoc(doc(db, 'users', uid), data, { merge: true });
}
