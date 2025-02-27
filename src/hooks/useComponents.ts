import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProcessComponent,
  createProductComponent,
  deleteBOMComponent,
  fetchBOMComponents,
} from "@/api/components";
import { toast } from "sonner";

export function useComponents(id: number) {
  return useQuery({
    queryKey: ["components", id],
    queryFn: () => fetchBOMComponents(id),
  });
}

export function useDeleteComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      componentId,
      bomId,
    }: {
      componentId: number;
      bomId: number;
    }) => {
      await deleteBOMComponent(bomId, componentId);
    },
    onSuccess: (_, { bomId, componentId }) => {
      queryClient.invalidateQueries({ queryKey: ["components", componentId] });
      queryClient.removeQueries({ queryKey: ["components", componentId] });
      toast.success("Komponent başarıyla silindi.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useCreateProductComponent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProductComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] });
    },
  });
}

export function useCreateProcessComponent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProcessComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] });
    },
  });
}
