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
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 1,
    staleTime: 0,
  });
}

export function useCreateComponent(bomId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BOMComponent>) => createComponent(bomId, data),
    onSuccess: () => {
      // Invalidate the specific components query for this BOM
      queryClient.invalidateQueries({
        queryKey: ["components", bomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bom", bomId],
      });
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
      return updateComponent(bomId, componentId, data);
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
      const result = await deleteComponent(bomId, componentId);
      return { result, componentId };
    },
    onSuccess: (_, { bomId }) => {
      // Invalidate both the components and BOM queries
      queryClient.invalidateQueries({ queryKey: ["components", bomId] });
      queryClient.invalidateQueries({ queryKey: ["bom", bomId] });
    },
    onMutate: async ({ bomId, componentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["components", bomId] });
      await queryClient.cancelQueries({ queryKey: ["bom", bomId] });

      // Snapshot the previous value
      const previousComponents = queryClient.getQueryData([
        "components",
        bomId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["components", bomId], (old: any) => {
        return (
          old?.filter((component: any) => component.id !== componentId) ?? []
        );
      });

      // Return a context object with the snapshotted value
      return { previousComponents };
    },
    onError: (error: Error, { bomId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(
        ["components", bomId],
        context?.previousComponents
      );
    },
    onSettled: (_, __, { bomId }) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["components", bomId] });
      queryClient.invalidateQueries({ queryKey: ["bom", bomId] });
    },
  });
}
