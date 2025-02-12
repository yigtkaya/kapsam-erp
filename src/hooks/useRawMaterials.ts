import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RawMaterial,
  ApiPaginatedResponse,
  UnitOfMeasure,
  MaterialType,
} from "@/types/inventory";
import {
  fetchRawMaterials,
  fetchRawMaterial,
  fetchUnitOfMeasures,
} from "@/app/warehouse/raw-materials/api/fetch";
import {
  createRawMaterial,
  deleteRawMaterial,
  updateRawMaterial,
} from "@/app/warehouse/raw-materials/api/post";

interface UseRawMaterialsParams {
  category?: string;
  material_name?: string;
  material_code?: string;
  page?: number;
  page_size?: number;
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
  page = 1,
  page_size = 50,
}: UseRawMaterialsParams) {
  return useQuery<ApiPaginatedResponse<RawMaterial>>({
    queryKey: [
      "rawMaterials",
      category,
      material_name,
      material_code,
      page,
      page_size,
    ],
    queryFn: () =>
      fetchRawMaterials({
        category,
        material_name,
        material_code,
        page,
        page_size,
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
