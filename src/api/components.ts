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

// GET /api/manufacturing/boms/{bom_pk}/components/                  # List components of a specific BOM
// GET /api/manufacturing/boms/{bom_pk}/components/{id}/            # Get a specific component
// POST /api/manufacturing/boms/{bom_pk}/components/                # Add a component to a BOM
// PUT /api/manufacturing/boms/{bom_pk}/components/{id}/            # Update a component
// DELETE /api/manufacturing/boms/{bom_pk}/components/{id}/         # Delete a component

export async function getAllComponentsForBom(bomId: number) {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_URL}/api/manufacturing/boms/${bomId}/components/`,
    {
      headers,
    }
  );

  if (!response.ok) {
    console.log(response);
    console.log(await response.json());
    throw new Error(response.statusText);
  }

  const responseData = await response.json();
  return responseData;
}

export async function getComponent(bomId: number, id: number) {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_URL}/api/manufacturing/boms/${bomId}/components/${id}/`,
    {
      headers,
    }
  );
  return response.json();
}

export async function createComponent(
  bomId: number,
  data: Partial<BOMComponent>
) {
  const headers = await getAuthHeaders();

  console.log(data);

  const response = await fetch(
    `${API_URL}/api/manufacturing/boms/${bomId}/components/`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    console.log(response);
    console.log(await response.json());
    throw new Error(response.statusText);
  }

  const responseData = await response.json();
  console.log(responseData);
  return responseData;
}

export async function updateComponent(
  bomId: number,
  id: number,
  data: Partial<BOMComponent>
) {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_URL}/api/manufacturing/boms/${bomId}/components/${id}/`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const responseData = await response.json();
  return responseData;
}

export async function deleteComponent(bomId: number, id: number) {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_URL}/api/manufacturing/boms/${bomId}/components/${id}/`,
    {
      method: "DELETE",
      headers,
    }
  );

  console.log(response);

  if (!response.ok) {
    console.log(response.statusText);
    console.log(response);
    throw new Error(response.statusText);
  }

  return true;
}
