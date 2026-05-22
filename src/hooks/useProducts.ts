import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getProductById, getProducts, getProductsPage, type ProductFilters } from '@services/productService';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters)
  });
}

export function useInfiniteProducts(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: ['products-infinite', filters],
    initialPageParam: null as any,
    queryFn: ({ pageParam }) => getProductsPage(filters, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: Boolean(id)
  });
}
