import { useQuery } from "@tanstack/react-query";
import { RawMaterial, ApiPaginatedResponse } from "@/types/inventory";
import { fetchRawMaterials } from "@/app/warehouse/raw-materials/api/fetch";

interface UseRawMaterialsParams {
  category?: string;
  material_name?: string;
  material_code?: string;
  page?: number;
  page_size?: number;
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
