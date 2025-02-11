"use server";

import { ApiPaginatedResponse } from "@/types/inventory";
import { Product, RawMaterial } from "@/types/inventory";
import { cookies } from "next/headers";

const API_URL = "http://localhost:8000";

interface FetchRawMaterialsParams {
  category?: string;
  material_name?: string;
  material_code?: string;
  page?: number;
  page_size?: number;
}

export async function fetchRawMaterials({
  category,
  material_name,
  material_code,
  page = 1,
  page_size = 50,
}: FetchRawMaterialsParams): Promise<ApiPaginatedResponse<RawMaterial>> {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (material_name) params.append("material_name", material_name);
  if (material_code) params.append("material_code", material_code);
  params.append("page", page.toString());
  params.append("page_size", page_size.toString());

  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(
    `${API_URL}/api/inventory/raw-materials/?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken || "",
        Cookie: `sessionid=${sessionid}${
          csrftoken ? `; csrftoken=${csrftoken}` : ""
        }`,
      },
    }
  );

  console.log(response);

  if (!response.ok) {
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }

  return response.json();
}

interface FetchProductsParams {
  category?: string;
  product_type?: string;
  product_name?: string;
  product_code?: string;
  page?: number;
  page_size?: number;
}

export async function fetchProducts({
  category,
  product_type,
  product_name,
  product_code,
  page = 1,
  page_size = 50,
}: FetchProductsParams): Promise<ApiPaginatedResponse<Product>> {
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (product_type) params.append("product_type", product_type);
  if (product_name) params.append("product_name", product_name);
  if (product_code) params.append("product_code", product_code);
  params.append("page", page.toString());
  params.append("page_size", page_size.toString());
  console.log(params.toString());

  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;
  const response = await fetch(
    `${API_URL}/api/inventory/products/?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken || "",
        Cookie: `sessionid=${sessionid}${
          csrftoken ? `; csrftoken=${csrftoken}` : ""
        }`,
      },
    }
  );

  if (!response.ok) {
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }

  return response.json();
}
