"use server";

import {
  ApiPaginatedResponse,
  MaterialType,
  UnitOfMeasure,
} from "@/types/inventory";
import { Product, RawMaterial } from "@/types/inventory";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RawMaterialsParams {
  category?: string;
  material_name?: string;
  material_code?: string;
  page?: number;
  page_size?: number;
}

interface RawMaterialParams {
  id: string;
}

export async function fetchRawMaterial({
  id,
}: RawMaterialParams): Promise<RawMaterial> {
  const cookieStore = await cookies();

  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(
    `${API_URL}/api/inventory/raw-materials/${id}/`,
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
    console.log(response);
    throw new Error("Failed to fetch raw material");
  }

  const data = await response.json();
  return data;
}

export async function fetchRawMaterials({
  category,
  material_name,
  material_code,
  page = 1,
  page_size = 50,
}: RawMaterialsParams): Promise<ApiPaginatedResponse<RawMaterial>> {
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

  if (!response.ok) {
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }

  const data = await response.json();
  return data;
}

export async function fetchUnitOfMeasures(): Promise<UnitOfMeasure[]> {
  const cookieStore = await cookies();

  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(`${API_URL}/api/inventory/units/`, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}
