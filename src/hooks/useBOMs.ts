import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BOM } from "@/types/manufacture";
import {
  createBOM,
  deleteBOM,
  fetchBOM,
  fetchBOMs,
  updateBOM,
} from "@/api/boms";

interface UseBOMsParams {
  product?: string;
  version?: string;
  is_active?: boolean;
}

export function useBOMs({ product, version, is_active }: UseBOMsParams = {}) {
  return useQuery<BOM[]>({
    queryKey: ["boms", product, version, is_active],
    queryFn: () => fetchBOMs(),
    select: (data) => {
      return data.filter((bom) => {
        if (product && bom.product !== product) return false;
        if (version && bom.version !== version) return false;
        if (is_active !== undefined && bom.is_active !== is_active)
          return false;
        return true;
      });
    },
  });
}

export function useBOM(id: number) {
  return useQuery<BOM>({
    queryKey: ["bom", id],
    queryFn: () => fetchBOM(id),
  });
}

export function useCreateBOM() {
  const queryClient = useQueryClient();

  return useMutation<BOM, Error, Omit<BOM, "id">>({
    mutationFn: createBOM,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
    },
  });
}

export function useUpdateBOM() {
  const queryClient = useQueryClient();

  return useMutation<BOM, Error, { id: number; data: Partial<BOM> }>({
    mutationFn: ({ id, data }) => updateBOM(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
      queryClient.invalidateQueries({ queryKey: ["bom", variables.id] });
    },
  });
}

export function useDeleteBOM() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: deleteBOM,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
      queryClient.removeQueries({ queryKey: ["bom", id] });
    },
  });
}
