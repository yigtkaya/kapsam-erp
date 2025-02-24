"use server";

import { BOM, BOMRequest } from "@/types/manufacture";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to get cookies and headers
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  return {
    "Content-Type": "application/json",
    "X-CSRFToken": csrftoken || "",
    Cookie: `sessionid=${sessionid}${
      csrftoken ? `; csrftoken=${csrftoken}` : ""
    }`,
  };
}

export async function fetchBOM(id: number): Promise<BOM> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/manufacturing/boms/${id}/`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch BOM");
  }

  return await response.json();
}

export async function fetchBOMs(): Promise<BOM[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/manufacturing/boms/`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch BOMs");
  }

  return await response.json();
}

export async function createBOM(data: Omit<BOMRequest, "id">) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(`${API_URL}/api/manufacturing/boms/`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create BOM");
    }

    revalidatePath("/boms");
    return await response.json();
  } catch (error) {
    console.error("Error creating BOM:", error);
    throw error;
  }
}

export async function updateBOM(id: number, data: Partial<BOMRequest>) {
  const headers = await getAuthHeaders();

  console.log(headers);

  try {
    const response = await fetch(`${API_URL}/api/manufacturing/boms/${id}/`, {
      method: "PATCH",
      credentials: "include",
      headers,
      body: JSON.stringify(data),
    });

    // Store the response JSON to avoid reading the body twice
    const responseData = await response.json();
    console.log(responseData);

    if (!response.ok) {
      throw new Error("Failed to update BOM");
    }

    revalidatePath("/boms");
    return responseData;
  } catch (error) {
    console.error("Error updating BOM:", error);
    throw error;
  }
}

export async function deleteBOM(id: number) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(`${API_URL}/api/manufacturing/boms/${id}/`, {
      method: "DELETE",
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to delete BOM");
    }

    revalidatePath("/boms");
    return true;
  } catch (error) {
    console.error("Error deleting BOM:", error);
    throw error;
  }
}
