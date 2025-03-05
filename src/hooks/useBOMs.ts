"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBOM,
  deleteBOM,
  fetchBOM,
  fetchBOMs,
  updateBOM,
} from "@/api/boms";
import {
  BOM,
  BOMComponent,
  BomRequest,
  CreateBOMComponentRequest,
  CreateBOMRequest,
} from "@/types/manufacture";
import {
  createComponent,
  deleteComponent,
  updateComponent,
} from "@/api/components";

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
    mutationFn: (data: CreateBOMRequest) => createBOM(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
    },
  });
}

export function useUpdateBOM() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BomRequest }) =>
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
  return useMutation<BOM, Error, { id: number; components: BOMComponent[] }>({
    mutationFn: async ({ id, components }) => {
      await Promise.all(
        components.map((component) => updateComponent(component.id, component))
      );
      return fetchBOM(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
      queryClient.invalidateQueries({ queryKey: ["bom", variables.id] });
    },
  });
}

export function useAddBOMComponent() {
  const queryClient = useQueryClient();
  return useMutation<
    BOMComponent,
    Error,
    { bomId: number; component: CreateBOMComponentRequest }
  >({
    mutationFn: async ({ bomId, component }) => {
      return createComponent({ ...component, bom: bomId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
      queryClient.invalidateQueries({ queryKey: ["bom", variables.bomId] });
    },
  });
}
