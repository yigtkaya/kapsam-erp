import { useQuery } from "@tanstack/react-query";

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface RawMaterial {
  id: string;
  material_code: string;
  material_name: string;
  current_stock: number;
  category: string;
  // Add other raw material fields as needed
}

interface FetchRawMaterialsParams {
  category: string;
  page?: number;
  pageSize?: number;
}

// Function to fetch raw materials by category with pagination
async function fetchRawMaterials({
  category,
  page = 1,
  pageSize = 50,
}: FetchRawMaterialsParams): Promise<PaginatedResponse<RawMaterial>> {
  const response = await fetch(
    `/api/raw-materials/?category=${encodeURIComponent(
      category
    )}&page=${page}&page_size=${pageSize}`
  );

  if (!response.ok) {
    throw new Error("Error fetching raw materials");
  }

  return response.json();
}

export function useRawMaterials(
  category: string,
  page: number = 1,
  pageSize: number = 50
) {
  return useQuery({
    queryKey: ["rawMaterials", category, page, pageSize],
    queryFn: () => fetchRawMaterials({ category, page, pageSize }),
  });
}
