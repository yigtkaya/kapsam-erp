"use server";

import { BOMComponent } from "@/types/manufacture";
import { cookies } from "next/headers";

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

export async function getAllComponentsForBom(bomId: number) {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_URL}/inventory/bom-components/?bom=${bomId}`,
    {
      headers,
    }
  );
  return response.json();
}

export async function getComponent(id: number) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/inventory/bom-components/${id}/`, {
    headers,
  });
  return response.json();
}

export async function createComponent(data: Partial<BOMComponent>) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/inventory/bom-components/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const responseData = await response.json();
  console.log(responseData);
  return responseData;
}

export async function updateComponent(id: number, data: Partial<BOMComponent>) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/inventory/bom-components/${id}/`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const responseData = await response.json();
  return responseData;
}

export async function deleteComponent(id: number) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/inventory/bom-components/${id}/`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}
