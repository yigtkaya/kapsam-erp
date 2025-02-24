import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductComponent } from "@/types/manufacture";

import {
  createProductComponent,
  deleteProductComponent,
  fetchProductComponent,
  fetchProductComponents,
  updateProductComponent,
} from "@/api/product-comp";

interface UseProductCompParams {
  product?: string;
  raw_material?: string;
  quantity?: number;
  notes?: string;
  bom?: string;
  sequence_order?: number;
}

export function useProductComponents() {
  return useQuery<ProductComponent[]>({
    queryKey: ["product-components"],
    queryFn: () => fetchProductComponents(),
  });
}

export function useProductComponent(id: number) {
  return useQuery<ProductComponent>({
    queryKey: ["product-component", id],
    queryFn: () => fetchProductComponent(id),
  });
}

export function useCreateProductComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-components"] });
    },
  });
}

export function useUpdateProductComponent(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProductComponent>) =>
      updateProductComponent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-components"] });
    },
  });
}

export function useDeleteProductComponent(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-components"] });

      queryClient.removeQueries({ queryKey: ["process-component", id] });
    },
  });
}
