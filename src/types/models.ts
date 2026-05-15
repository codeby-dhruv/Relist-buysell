export type ProductCondition = 'new' | 'like-new' | 'good' | 'fair';

export type ProductCategory =
  | 'electronics'
  | 'mobile'
  | 'laptop'
  | 'tablet'
  | 'furniture'
  | 'fashion'
  | 'vehicles'
  | 'bike'
  | 'car'
  | 'tractor'
  | 'rickshaw'
  | 'pets'
  | 'cattle'
  | 'books'
  | 'home'
  | 'real-estate'
  | 'hostel-pg'
  | 'rentals'
  | 'services'
  | 'plumber'
  | 'photography'
  | 'health'
  | 'developer'
  | 'designer'
  | 'cleaner'
  | 'jobs'
  | 'sports'
  | 'collectibles';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  location?: string;
  rating: number;
  totalSales: number;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  imageUrls: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  location: string;
  isFeatured?: boolean;
  createdAt: string;
  views: number;
  saves: number;
}

export interface ChatPreview {
  id: string;
  productId: string;
  productTitle: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface ActivityItem {
  id: string;
  label: string;
  value: string;
  time: string;
}
