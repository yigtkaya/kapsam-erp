"use server";

import { BOM, BomRequest } from "@/types/manufacture";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to get cookies and headers
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;
  // Extract the token value from the raw cookie string.
  // This regex looks for `csrftoken=` followed by a group of non-semicolon characters.
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;

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
    console.log(response);
    console.log(await response.json());
    throw new Error("Failed to fetch BOM");
  }

  const responseData = await response.json();
  return responseData;
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

export async function createBOM(data: BomRequest) {
  const headers = await getAuthHeaders();

  console.log(data);

  try {
    const response = await fetch(`${API_URL}/api/manufacturing/boms/`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.log(response);
      console.log(await response.json());
      throw new Error(response.statusText);
    }

    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error creating BOM:", error);
    throw error;
  }
}

export async function updateBOM(id: number, data: BomRequest) {
  const headers = await getAuthHeaders();

  console.log(data);

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
