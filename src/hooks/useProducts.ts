import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/app/warehouse/raw-materials/api/fetch";
import { Product, ApiPaginatedResponse } from "@/types/inventory";

interface UseProductsParams {
  category?: string;
  product_type?: string;
  product_name?: string;
  product_code?: string;
  page?: number;
  page_size?: number;
}

export function useProducts({
  category,
  product_type,
  product_name,
  product_code,
  page = 1,
  page_size = 50,
}: UseProductsParams) {
  return useQuery<ApiPaginatedResponse<Product>>({
    queryKey: [
      "products",
      category,
      product_type,
      product_name,
      product_code,
      page,
      page_size,
    ],
    queryFn: () =>
      fetchProducts({
        category,
        product_type,
        product_name,
        product_code,
        page,
        page_size,
      }),
  });
}
