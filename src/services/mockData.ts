import type { ActivityItem, ChatPreview, Product, UserProfile } from '@/types/models';

export const demoUser: UserProfile = {
  id: 'demo-user',
  displayName: 'Avery Stone',
  email: 'avery@relist.app',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  location: 'San Francisco, CA',
  rating: 4.9,
  totalSales: 38,
  createdAt: new Date().toISOString()
};

export const products: Product[] = [
  {
    id: 'p1',
    title: 'MacBook Pro 14 M3 Pro',
    description: 'Space black, 18GB memory, 512GB SSD. Includes box, charger, and AppleCare until late 2026.',
    price: 1690,
    category: 'electronics',
    condition: 'like-new',
    imageUrls: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'],
    sellerId: 'u1',
    sellerName: 'Mina Lee',
    sellerAvatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=256&q=80',
    location: 'Palo Alto, CA',
    isFeatured: true,
    createdAt: '2026-05-12T10:20:00.000Z',
    views: 984,
    saves: 91
  },
  {
    id: 'p2',
    title: 'Herman Miller Sayl Chair',
    description: 'Ergonomic office chair in excellent condition. Smooth recline and adjustable arms.',
    price: 410,
    category: 'furniture',
    condition: 'good',
    imageUrls: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1200&q=80'],
    sellerId: 'u2',
    sellerName: 'Noah Carter',
    location: 'Oakland, CA',
    createdAt: '2026-05-10T13:12:00.000Z',
    views: 513,
    saves: 44
  },
  {
    id: 'p3',
    title: 'Sony A7 IV Camera Kit',
    description: 'Body plus 28-70mm lens, two batteries, and sling. Shutter count under 8k.',
    price: 1880,
    category: 'electronics',
    condition: 'good',
    imageUrls: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80'],
    sellerId: 'u3',
    sellerName: 'Luca Evans',
    location: 'San Jose, CA',
    isFeatured: true,
    createdAt: '2026-05-08T09:00:00.000Z',
    views: 1207,
    saves: 126
  },
  {
    id: 'p4',
    title: 'West Elm Marble Coffee Table',
    description: 'Round marble top with brass base. Small mark on one side, priced accordingly.',
    price: 320,
    category: 'home',
    condition: 'fair',
    imageUrls: ['https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=1200&q=80'],
    sellerId: 'u4',
    sellerName: 'Priya Rao',
    location: 'Berkeley, CA',
    createdAt: '2026-05-05T17:40:00.000Z',
    views: 272,
    saves: 19
  },
  {
    id: 'p5',
    title: 'Vintage Omega Seamaster',
    description: 'Recently serviced automatic watch with original bracelet and leather strap.',
    price: 2450,
    category: 'collectibles',
    condition: 'good',
    imageUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80'],
    sellerId: 'u5',
    sellerName: 'Theo James',
    location: 'San Francisco, CA',
    isFeatured: true,
    createdAt: '2026-05-03T12:00:00.000Z',
    views: 1888,
    saves: 203
  },
  {
    id: 'p6',
    title: 'Specialized Road Bike',
    description: 'Carbon frame, Shimano 105 groupset, recently tuned and ready for weekend rides.',
    price: 980,
    category: 'sports',
    condition: 'good',
    imageUrls: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80'],
    sellerId: 'u6',
    sellerName: 'Iris Chen',
    location: 'Daly City, CA',
    createdAt: '2026-04-29T08:30:00.000Z',
    views: 711,
    saves: 63
  }
];

export const chats: ChatPreview[] = [
  {
    id: 'c1',
    productId: 'p1',
    productTitle: 'MacBook Pro 14 M3 Pro',
    participantName: 'Mina Lee',
    participantAvatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=256&q=80',
    lastMessage: 'I can meet near Ferry Building after 5.',
    updatedAt: '2026-05-15T09:00:00.000Z',
    unreadCount: 2
  },
  {
    id: 'c2',
    productId: 'p3',
    productTitle: 'Sony A7 IV Camera Kit',
    participantName: 'Luca Evans',
    lastMessage: 'Happy to send a quick shutter count photo.',
    updatedAt: '2026-05-14T18:20:00.000Z',
    unreadCount: 0
  }
];

export const activity: ActivityItem[] = [
  { id: 'a1', label: 'Listing saved', value: 'Vintage Omega Seamaster', time: '12 min ago' },
  { id: 'a2', label: 'Offer received', value: '$1,620 for MacBook Pro', time: '1 hr ago' },
  { id: 'a3', label: 'Profile view', value: '7 new seller profile views', time: '3 hrs ago' }
];
