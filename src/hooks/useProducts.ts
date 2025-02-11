import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts } from "@/app/warehouse/raw-materials/api/fetch";
import { Product, ApiPaginatedResponse } from "@/types/inventory";
import { createProduct } from "@/app/warehouse/raw-materials/api/post";

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

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
