import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProduct,
  fetchProducts,
  createProduct,
  createTechnicalDrawing,
  updateProduct,
  deleteProduct,
} from "@/api/products";
import { Product, TechnicalDrawing } from "@/types/inventory";
import { fetchProducts as clientFetchProducts } from "@/api/products";

interface UseProductsParams {
  category?: string;
  product_type?: string;
  product_name?: string;
  product_code?: string;
}

export function useProducts({
  category,
  product_type,
  product_name,
  product_code,
}: UseProductsParams = {}) {
  return useQuery<Product[]>({
    queryKey: ["products", category, product_type, product_name, product_code],
    queryFn: () =>
      clientFetchProducts({
        category,
        product_type,
        product_name,
        product_code,
      }),
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetchProduct({ id }),
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

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, deletedProduct) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      queryClient.removeQueries({ queryKey: ["product", deletedProduct] });
    },
  });
}

export function useCreateTechnicalDrawing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      technicalDrawing,
      product_id,
    }: {
      technicalDrawing: TechnicalDrawing;
      product_id: number;
    }) => createTechnicalDrawing(technicalDrawing, product_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
    },
  });
}
