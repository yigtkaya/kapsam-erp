import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RawMaterial, UnitOfMeasure } from "@/types/inventory";
import {
  fetchRawMaterials,
  fetchRawMaterial,
  fetchUnitOfMeasures,
} from "@/app/(protected)/warehouse/raw-materials/api/fetch";
import {
  createRawMaterial,
  deleteRawMaterial,
  updateRawMaterial,
} from "@/app/(protected)/warehouse/raw-materials/api/post";

interface UseRawMaterialsParams {
  category?: string;
  material_name?: string;
  material_code?: string;
}

interface RawMaterialParams {
  id: string;
}

export function useRawMaterial({ id }: RawMaterialParams) {
  return useQuery<RawMaterial>({
    queryKey: ["rawMaterial", id],
    queryFn: () => fetchRawMaterial({ id }),
  });
}

export function useRawMaterials({
  category,
  material_name,
  material_code,
}: UseRawMaterialsParams) {
  return useQuery<RawMaterial[]>({
    queryKey: ["rawMaterials"],
    queryFn: () =>
      fetchRawMaterials({
        category,
        material_name,
        material_code,
      }),
  });
}

export function useCreateRawMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRawMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rawMaterials"],
        exact: false,
      });
    },
  });
}

export function useUpdateRawMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRawMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rawMaterials"],
        exact: false,
      });
    },
  });
}

export function useDeleteRawMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRawMaterial,
    onSuccess: (_, deletedRawMaterial) => {
      // Invalidate and force a refetch
      queryClient.invalidateQueries({ queryKey: ["rawMaterials"] });
      queryClient.refetchQueries({ queryKey: ["rawMaterials"] });
      // Remove the individual user cache
      queryClient.removeQueries({
        queryKey: ["rawMaterials", deletedRawMaterial],
      });
    },
  });
}

export function useUnitOfMeasures() {
  return useQuery<UnitOfMeasure[]>({
    queryKey: ["unitOfMeasures"],
    queryFn: fetchUnitOfMeasures,
  });
}
