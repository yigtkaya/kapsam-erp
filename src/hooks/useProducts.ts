import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProduct,
  createProduct,
  createTechnicalDrawing,
  updateProduct,
  deleteProduct,
  fetchProcessProducts,
  createProcessProduct,
} from "@/api/products";
import { ProcessProduct, Product, TechnicalDrawing } from "@/types/inventory";
import { fetchProducts as clientFetchProducts } from "@/api/products";

export function useProcessProducts() {
  return useQuery<ProcessProduct[]>({
    queryKey: ["process-products"],
    queryFn: () => fetchProcessProducts(),
  });
}

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

export function useCreateProcessProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProcessProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
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
