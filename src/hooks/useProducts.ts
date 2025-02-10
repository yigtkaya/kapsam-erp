import { useQuery } from "@tanstack/react-query";

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface Product {
  id: string;
  product_code: string;
  product_name: string;
  product_type: string;
  current_stock: number;
  category: string;
  // Add other product fields as needed
}

interface FetchProductsParams {
  category: string;
  productType: string;
  page?: number;
  pageSize?: number;
}

// Function to fetch products by category and product type with pagination
async function fetchProducts({
  category,
  productType,
  page = 1,
  pageSize = 50,
}: FetchProductsParams): Promise<PaginatedResponse<Product>> {
  const response = await fetch(
    `/api/products/?category=${encodeURIComponent(
      category
    )}&product_type=${encodeURIComponent(
      productType
    )}&page=${page}&page_size=${pageSize}`
  );

  if (!response.ok) {
    throw new Error("Error fetching products");
  }

  return response.json();
}

export function useProducts(
  category: string,
  productType: string,
  page: number = 1,
  pageSize: number = 50
) {
  return useQuery({
    queryKey: ["products", category, productType, page, pageSize],
    queryFn: () => fetchProducts({ category, productType, page, pageSize }),
  });
}
