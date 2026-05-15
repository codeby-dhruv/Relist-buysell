import { useQuery } from '@tanstack/react-query';
import { getProductById, getProducts, type ProductFilters } from '@services/productService';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters)
  });
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: Boolean(id)
  });
}
