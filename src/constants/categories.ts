import {
  Armchair,
  Bike,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Camera,
  Car,
  Dog,
  Dumbbell,
  Gem,
  Hammer,
  HeartPulse,
  Home,
  Laptop,
  MonitorSmartphone,
  Paintbrush,
  PawPrint,
  PlugZap,
  Shirt,
  Smartphone,
  Sparkles,
  Tablet,
  Tractor,
  Truck,
  Wrench,
  type LucideIcon
} from 'lucide-react';
import type { ProductCategory, ProductCondition } from '@/types/models';

type CategoryMeta = { id: ProductCategory; label: string; icon: LucideIcon; accent: string; group: 'market' | 'services' | 'property' | 'mobility' };
const market = (category: Omit<CategoryMeta, 'group'>): CategoryMeta => ({ group: 'market', ...category });

export const categories: CategoryMeta[] = [
  market({ id: 'electronics', label: 'Electronics', icon: Laptop, accent: 'from-cyan-500 to-teal-500' }),
  { id: 'mobile', label: 'Mobile', icon: Smartphone, accent: 'from-blue-500 to-cyan-500', group: 'market' },
  { id: 'laptop', label: 'Laptop', icon: MonitorSmartphone, accent: 'from-indigo-500 to-sky-500', group: 'market' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, accent: 'from-violet-500 to-indigo-500', group: 'market' },
  market({ id: 'furniture', label: 'Furniture', icon: Armchair, accent: 'from-amber-500 to-rose-500' }),
  market({ id: 'fashion', label: 'Fashion', icon: Shirt, accent: 'from-fuchsia-500 to-pink-500' }),
  { id: 'vehicles', label: 'Vehicles', icon: Car, accent: 'from-blue-500 to-indigo-500', group: 'mobility' },
  { id: 'bike', label: 'Bike', icon: Bike, accent: 'from-emerald-500 to-teal-500', group: 'mobility' },
  { id: 'car', label: 'Car', icon: Car, accent: 'from-sky-500 to-blue-600', group: 'mobility' },
  { id: 'tractor', label: 'Tractor', icon: Tractor, accent: 'from-lime-500 to-green-600', group: 'mobility' },
  { id: 'rickshaw', label: 'Rickshaw', icon: Truck, accent: 'from-yellow-500 to-orange-500', group: 'mobility' },
  { id: 'pets', label: 'Dog & Pets', icon: Dog, accent: 'from-orange-400 to-rose-500', group: 'market' },
  { id: 'cattle', label: 'Cow & Cattle', icon: PawPrint, accent: 'from-stone-500 to-amber-600', group: 'market' },
  market({ id: 'books', label: 'Books', icon: BookOpen, accent: 'from-lime-500 to-emerald-500' }),
  market({ id: 'home', label: 'Home', icon: Home, accent: 'from-orange-500 to-red-500' }),
  { id: 'real-estate', label: 'Real Estate', icon: Building2, accent: 'from-slate-600 to-slate-900', group: 'property' },
  { id: 'hostel-pg', label: 'Hostel / PG', icon: Home, accent: 'from-purple-500 to-indigo-600', group: 'property' },
  { id: 'rentals', label: 'Rentals', icon: PlugZap, accent: 'from-teal-500 to-blue-500', group: 'property' },
  { id: 'services', label: 'Services', icon: Hammer, accent: 'from-rose-500 to-orange-500', group: 'services' },
  { id: 'plumber', label: 'Plumber', icon: Wrench, accent: 'from-cyan-600 to-blue-600', group: 'services' },
  { id: 'photography', label: 'Photography', icon: Camera, accent: 'from-fuchsia-500 to-purple-600', group: 'services' },
  { id: 'health', label: 'Doctor / Health', icon: HeartPulse, accent: 'from-red-500 to-pink-500', group: 'services' },
  { id: 'developer', label: 'Developer', icon: Laptop, accent: 'from-slate-700 to-violet-700', group: 'services' },
  { id: 'designer', label: 'Designer', icon: Paintbrush, accent: 'from-pink-500 to-violet-500', group: 'services' },
  { id: 'cleaner', label: 'Cleaner', icon: Sparkles, accent: 'from-teal-400 to-emerald-500', group: 'services' },
  { id: 'jobs', label: 'Jobs', icon: BriefcaseBusiness, accent: 'from-blue-600 to-violet-600', group: 'services' },
  market({ id: 'sports', label: 'Sports', icon: Dumbbell, accent: 'from-violet-500 to-purple-500' }),
  market({ id: 'collectibles', label: 'Collectibles', icon: Gem, accent: 'from-sky-500 to-blue-500' })
];

export const conditions: Array<{ id: ProductCondition; label: string }> = [
  { id: 'new', label: 'New' },
  { id: 'like-new', label: 'Like new' },
  { id: 'good', label: 'Good' },
  { id: 'fair', label: 'Fair' }
];
