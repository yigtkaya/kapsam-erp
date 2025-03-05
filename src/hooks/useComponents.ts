import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createComponent,
  updateComponent,
  deleteComponent,
  getAllComponentsForBom,
} from "@/api/components";
import { BOMComponent } from "@/types/manufacture";
import { toast } from "sonner";

export function useComponents(bomId: number) {
  return useQuery({
    queryKey: ["components", bomId],
    queryFn: () => getAllComponentsForBom(bomId),
    enabled: !!bomId,
  });
}

export function useCreateComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bomId,
      data,
    }: {
      bomId: number;
      data: Omit<BOMComponent, "id" | "created_at" | "updated_at" | "bom">;
    }) => {
      return createComponent(data);
    },
    onSuccess: (_, { bomId }) => {
      queryClient.invalidateQueries({ queryKey: ["components", bomId] });
      toast.success("Komponent başarıyla oluşturuldu.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bomId,
      componentId,
      data,
    }: {
      bomId: number;
      componentId: number;
      data: Partial<
        Omit<BOMComponent, "id" | "created_at" | "updated_at" | "bom">
      >;
    }) => {
      return updateComponent(componentId, data);
    },
    onSuccess: (_, { bomId }) => {
      queryClient.invalidateQueries({ queryKey: ["components", bomId] });
      toast.success("Komponent başarıyla güncellendi.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bomId,
      componentId,
    }: {
      bomId: number;
      componentId: number;
    }) => {
      return deleteComponent(componentId);
    },
    onSuccess: (_, { bomId }) => {
      queryClient.invalidateQueries({ queryKey: ["components", bomId] });
      toast.success("Komponent başarıyla silindi.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
