"use server";

import { UnitOfMeasure } from "@/types/inventory";
import { RawMaterial } from "@/types/inventory";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RawMaterialsParams {
  category?: string;
  material_name?: string;
  material_code?: string;
  page?: number;
  page_size?: number;
  width_min?: number;
  width_max?: number;
  height_min?: number;
  height_max?: number;
  thickness_min?: number;
  thickness_max?: number;
  diameter_min?: number;
  diameter_max?: number;
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
  width_min,
  width_max,
  height_min,
  height_max,
  thickness_min,
  thickness_max,
  diameter_min,
  diameter_max,
}: RawMaterialsParams): Promise<RawMaterial[]> {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (material_name) params.append("material_name", material_name);
  if (material_code) params.append("material_code", material_code);
  if (width_min) params.append("width_min", width_min.toString());
  if (width_max) params.append("width_max", width_max.toString());
  if (height_min) params.append("height_min", height_min.toString());
  if (height_max) params.append("height_max", height_max.toString());
  if (thickness_min) params.append("thickness_min", thickness_min.toString());
  if (thickness_max) params.append("thickness_max", thickness_max.toString());
  if (diameter_min) params.append("diameter_min", diameter_min.toString());
  if (diameter_max) params.append("diameter_max", diameter_max.toString());
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
    return [];
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
