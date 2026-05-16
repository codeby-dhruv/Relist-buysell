import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Mail, Phone, User as UserIcon, LogOut, Trash2, Plus, Package, Edit2, Check, X, Moon, Sun, Globe } from 'lucide-react';
import { useAuthStore } from '@store/useAuthStore';
import { updateProfileData, logout } from '@services/authService';
import { compressImage, fileToBase64 } from '@utils/imageUtils';
import { getProductsByUser, deleteProduct } from '@services/productService';
import { copy } from '@constants/languages';
import { useAppStore } from '@store/useAppStore';
import type { Product } from '@/types/models';

export function ProfilePage() {
  const { user, profile, setProfile } = useAuthStore();
  const { theme, setTheme, language, setLanguage } = useAppStore();
  const t = copy[language];

  const [uploading, setUploading] = useState(false);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoadingProducts(true);
    getProductsByUser(user.uid)
      .then(setMyProducts)
      .finally(() => setLoadingProducts(false));
  }, [user]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const base64 = await fileToBase64(compressed);
      await updateProfileData(user.uid, { profilePic: base64 });
      setProfile({ ...(profile || {}), profilePic: base64 } as any);
    } catch (err) {
      console.error('Failed to upload image', err);
    } finally {
      setUploading(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed', err);
      alert('Logout failed. Please try again.');
    }
  }

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  function confirmDelete(productId: string) {
    setDeleteConfirmId(productId);
  }

  async function handleDelete() {
    if (!deleteConfirmId) return;
    setDeletingId(deleteConfirmId);
    try {
      await deleteProduct(deleteConfirmId);
      setMyProducts((prev) => prev.filter((p) => p.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete', err);
      alert('Failed to delete listing.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveProfile() {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateProfileData(user.uid, { displayName: editName, mobile: editMobile });
      setProfile({ ...(profile || {}), displayName: editName, mobile: editMobile } as any);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  }

  function startEditing() {
    setEditName(profile?.displayName || user?.displayName || '');
    setEditMobile(profile?.mobile || '');
    setIsEditing(true);
  }

  if (!user) {
    return (
      <div className="p-8 text-center flex flex-col items-center gap-4">
        <p className="text-slate-600 dark:text-slate-400">Please log in to view your profile.</p>
        <Link to="/auth" className="rounded-xl bg-teal-500 px-6 py-2 font-bold text-white transition hover:bg-teal-600">
          Go to Login / Register
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 pb-10">
      {/* Profile Card */}
      <div className="rounded-[32px] bg-white p-6 shadow-sm dark:bg-slate-950 md:p-8 relative">
        {!isEditing ? (
          <button onClick={startEditing} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-400 dark:hover:text-white">
            <Edit2 className="size-4" />
          </button>
        ) : (
          <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-400 dark:hover:text-white">
            <X className="size-4" />
          </button>
        )}

        <div className="flex flex-col items-center">
          <div className="relative mb-5">
            <div className="flex size-28 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-slate-200 dark:border-slate-800 dark:bg-slate-800">
              {profile?.profilePic ? (
                <img src={profile.profilePic} alt="Profile" className="h-full w-full object-cover" />
              ) : user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="size-14 text-slate-400" />
              )}
            </div>
            <label className={`absolute bottom-0 right-0 flex size-9 cursor-pointer items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${uploading ? 'bg-slate-400' : 'bg-teal-500'}`}>
              {uploading ? (
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Camera className="size-4" />
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {profile?.displayName || user.displayName || 'User'}
          </h1>
          <p className="text-sm text-slate-500">{t.memberSince || 'Member'}</p>
        </div>

        {/* Info rows or Edit Form */}
        <div className="mt-6 space-y-3">
          {isEditing ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="text-xs font-semibold text-slate-500 ml-1">Full Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 dark:border-white/10 dark:bg-white/5" placeholder="Enter your full name" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 ml-1">Mobile Number</label>
                <input value={editMobile} onChange={(e) => setEditMobile(e.target.value)} type="tel" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 dark:border-white/10 dark:bg-white/5" placeholder="Enter your mobile number" />
              </div>
              <button onClick={handleSaveProfile} disabled={savingProfile} className="w-full flex justify-center items-center gap-2 rounded-2xl bg-teal-500 py-3 text-sm font-bold text-white transition hover:bg-teal-600 disabled:opacity-50">
                {savingProfile ? <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Check className="size-4" />}
                Save Profile
              </button>
            </div>
          ) : (
            <>
              <InfoRow icon={<UserIcon className="size-4" />} color="indigo" label={t.fullName || 'Full Name'} value={profile?.displayName || user.displayName || '—'} />
              <InfoRow icon={<Mail className="size-4" />} color="teal" label={t.emailAddress || 'Email'} value={profile?.email || user.email || '—'} />
              <InfoRow icon={<Phone className="size-4" />} color="sky" label={t.mobileNumber || 'Mobile'} value={profile?.mobile || 'Not set'} />
            </>
          )}
        </div>
      </div>

      {/* Settings Section */}
      <div className="rounded-[32px] bg-white p-6 shadow-sm dark:bg-slate-950 md:p-8">
        <h2 className="text-base font-bold mb-4">Settings</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Dark Mode</p>
            </div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`relative h-6 w-11 rounded-full transition-colors ${theme === 'dark' ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <span className={`absolute top-1 size-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                <Globe className="size-4" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Language</p>
            </div>
            <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="bg-transparent text-sm font-medium text-teal-600 outline-none dark:text-teal-400">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="gu">ગુજરાતી</option>
            </select>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20">
                <LogOut className="size-4" />
              </div>
              Sign Out
            </div>
          </button>
        </div>
      </div>

      {/* My Listings */}
      <div className="rounded-[32px] bg-white p-6 shadow-sm dark:bg-slate-950 md:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold">My Listings ({myProducts.length})</h2>
          <Link
            to="/sell"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white"
          >
            <Plus className="size-3.5" /> Add New
          </Link>
        </div>

        {loadingProducts ? (
          <div className="flex items-center justify-center py-10">
            <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500" />
          </div>
        ) : myProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center text-slate-400">
            <Package className="size-12 opacity-40" />
            <p className="text-sm font-medium">No listings yet</p>
            <Link to="/sell" className="rounded-xl bg-teal-500 px-5 py-2 text-xs font-bold text-white hover:bg-teal-600">
              Create your first listing
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
                <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
                  {product.imageUrls?.[0] ? (
                    <img src={product.imageUrls[0]} alt={product.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center"><Package className="size-6 text-slate-400" /></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{product.title}</p>
                  <p className="text-xs font-bold text-teal-600">₹{product.price.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 capitalize">{product.condition} · {product.category}</p>
                </div>
                <button
                  onClick={() => confirmDelete(product.id)}
                  disabled={deletingId === product.id}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-rose-500 transition hover:bg-rose-50 disabled:opacity-40 dark:hover:bg-rose-500/10"
                >
                  {deletingId === product.id
                    ? <div className="size-4 animate-spin rounded-full border-2 border-rose-400 border-t-transparent" />
                    : <Trash2 className="size-4" />
                  }
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl dark:bg-slate-900 animate-in zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-rose-100 text-rose-500 dark:bg-rose-500/20 mb-4">
                <Trash2 className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Listing?</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to permanently delete this listing? This action cannot be undone.
              </p>
              <div className="mt-6 flex w-full gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-xl bg-rose-500 py-3 text-sm font-bold text-white transition hover:bg-rose-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, color, label, value }: { icon: React.ReactNode; color: string; label: string; value: string }) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
    teal: 'bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
    sky: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400',
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${colorMap[color]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

