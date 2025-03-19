import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBOM,
  deleteBOM,
  fetchBOM,
  fetchBOMs,
  updateBOM,
} from "@/api/boms";
import { BomRequest } from "@/types/manufacture";

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
  });
}

export function useCreateBOM() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BomRequest) => createBOM(data),
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
