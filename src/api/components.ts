"use server";

import {
  BOMProcessConfig,
  ProcessComponent,
  ProductComponent,
} from "@/types/manufacture";
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

export async function fetchBOMComponents(id: number) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/boms/${id}/components/`,
    {
      headers,
    }
  );

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to fetch BOM components");
  }

  const responseData = await response.json();
  console.log(responseData);

  return responseData;
}

export async function deleteBOMComponent(bomId: number, id: number) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/boms/${bomId}/components/${id}/`,
    {
      method: "DELETE",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete BOM component");
  }

  return true;
}

export async function deleteProcessComponent(id: number): Promise<boolean> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/process-components/${id}/`,
    {
      method: "DELETE",
      headers,
    }
  );

  console.log(response);

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.detail || "Failed to delete process component");
  }

  return true;
}

export async function createProductComponent(
  data: Omit<ProductComponent, "id">
): Promise<ProductComponent> {
  const headers = await getAuthHeaders();

  console.log(data);

  const response = await fetch(
    `${API_URL}/api/manufacturing/product-components/`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.detail || "Failed to create product component");
  }
  const responseData = await response.json();

  console.log(responseData);

  return responseData;
}

export async function createProcessComponent(
  data: Omit<ProcessComponent, "id">
): Promise<ProcessComponent> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/process-components/`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    }
  );

  console.log(response);

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.detail || "Failed to create process component");
  }

  const responseData = await response.json();
  console.log(responseData);

  return response.json();
}

export async function updateProductComponent(
  id: number,
  data: Partial<ProductComponent>
): Promise<ProductComponent> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/product-components/${id}/`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update product component");
  }

  return response.json();
}

export async function updateProcessComponent(
  id: number,
  data: Partial<ProcessComponent>
): Promise<ProcessComponent> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/process-components/${id}/`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.detail || "Failed to update process component");
  }

  const responseData = await response.json();
  console.log(responseData);

  return responseData;
}

export async function fetchProcessConfigs(): Promise<BOMProcessConfig[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/process-configs/`,
    {
      headers,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.detail || "Failed to fetch process configs");
  }

  const responseData = await response.json();
  console.log(responseData);

  return responseData;
}

export async function fetchProcessConfig(
  id: number
): Promise<BOMProcessConfig> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/p rocess-configs/${id}/`,
    {
      headers,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.detail || "Failed to fetch process config");
  }

  const responseData = await response.json();
  console.log(responseData);

  return responseData;
}
