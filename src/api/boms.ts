"use server";

import { BOM, BomRequest } from "@/types/manufacture";
import { revalidatePath } from "next/cache";
import { fetchApi, postApi, updateApi, deleteApi } from "./api-helpers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchBOM(id: number): Promise<BOM> {
  return fetchApi<BOM>(`/api/manufacturing/boms/${id}/`);
}

export async function fetchBOMs(): Promise<BOM[]> {
  return fetchApi<BOM[]>(`/api/manufacturing/boms/`);
}

export async function createBOM(data: BomRequest) {
  try {
    await postApi(`/api/manufacturing/boms/`, data);
    revalidatePath("/bom-lists");
    return { success: true };
  } catch (error) {
    console.error("Failed to create BOM:", error);
    return { success: false, error };
  }
}

export async function updateBOM(id: number, data: BomRequest) {
  try {
    await updateApi(`/api/manufacturing/boms/${id}/`, data);
    revalidatePath("/bom-lists");
    revalidatePath(`/bom-lists/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update BOM:", error);
    return { success: false, error };
  }
}

export async function deleteBOM(id: number) {
  try {
    await deleteApi(`/api/manufacturing/boms/${id}/`);
    revalidatePath("/bom-lists");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete BOM:", error);
    return { success: false, error };
  }
}
