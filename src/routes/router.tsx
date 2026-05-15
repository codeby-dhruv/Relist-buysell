import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@layouts/AppLayout';
import { AppErrorBoundary } from '@components/ui/AppErrorBoundary';
import { Skeleton } from '@components/ui/Skeleton';

const MarketplacePage = lazy(() => import('@pages/MarketplacePage').then((module) => ({ default: module.MarketplacePage })));
const ProductDetailPage = lazy(() => import('@pages/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage })));
const SellPage = lazy(() => import('@pages/SellPage').then((module) => ({ default: module.SellPage })));
const WishlistPage = lazy(() => import('@pages/WishlistPage').then((module) => ({ default: module.WishlistPage })));
const CategoriesPage = lazy(() => import('@pages/CategoriesPage').then((module) => ({ default: module.CategoriesPage })));
const DashboardPage = lazy(() => import('@pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const AuthPage = lazy(() => import('@pages/AuthPage').then((module) => ({ default: module.AuthPage })));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function PageLoader({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Skeleton className="h-[70vh] rounded-[32px]" />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <AppErrorBoundary />,
    children: [
      { index: true, element: <PageLoader><MarketplacePage /></PageLoader> },
      { path: 'products/:id', element: <PageLoader><ProductDetailPage /></PageLoader> },
      { path: 'sell', element: <PageLoader><SellPage /></PageLoader> },
      { path: 'wishlist', element: <PageLoader><WishlistPage /></PageLoader> },
      { path: 'categories', element: <PageLoader><CategoriesPage /></PageLoader> },
      { path: 'dashboard', element: <PageLoader><DashboardPage /></PageLoader> },
      { path: 'auth', element: <PageLoader><AuthPage /></PageLoader> },
      { path: '*', element: <PageLoader><NotFoundPage /></PageLoader> }
    ]
  }
]);
