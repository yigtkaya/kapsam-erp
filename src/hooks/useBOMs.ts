"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBOM,
  deleteBOM,
  fetchBOM,
  fetchBOMs,
  updateBOM,
} from "@/api/boms";
import { BOMResponse, BOMComponent, BOMRequest } from "@/types/manufacture";

export function useBOMs() {
  return useQuery({
    queryKey: ["boms"],
    queryFn: fetchBOMs,
  });
}

export function useBOM(id: number) {
  return useQuery({
    queryKey: ["bom", id],
    queryFn: () => fetchBOM(id),
    enabled: !!id,
  });
}

export function useCreateBOM() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<BOMRequest, "id">) => createBOM(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
    },
  });
}

export function useUpdateBOM() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<BOMRequest, "id"> }) =>
      updateBOM(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
      queryClient.invalidateQueries({ queryKey: ["bom", variables.id] });
    },
  });
}

export function useDeleteBOM() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBOM(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
    },
  });
}

// New hooks for BOM components

export function useUpdateBOMComponents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      components,
    }: {
      id: number;
      components: BOMComponent[];
    }) =>
      updateBOM(id, {
        components,
      } as Omit<BOMRequest, "id">),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
      queryClient.invalidateQueries({ queryKey: ["bom", variables.id] });
    },
  });
}

export function useAddBOMComponent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bomId,
      component,
    }: {
      bomId: number;
      component: Omit<BOMComponent, "id" | "component"> & { component: string };
    }) => {
      // First, get the current BOM
      const bom = await fetchBOM(bomId);

      // Add the new component to the existing components
      const updatedComponents = [
        ...(bom.components || []),
        {
          ...component,
          id: Date.now(), // Temporary ID that will be replaced by the server
          component: { id: parseInt(component.component) } as any, // Convert string ID to number
        },
      ];

      // Update the BOM with the new components
      return updateBOM(bomId, {
        components: updatedComponents,
      } as Omit<BOMRequest, "id">);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
      queryClient.invalidateQueries({ queryKey: ["bom", variables.bomId] });
    },
  });
}
