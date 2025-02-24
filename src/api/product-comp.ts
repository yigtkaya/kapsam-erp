"use server";

import { ProductComponent } from "@/types/manufacture";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchProductComponents(): Promise<ProductComponent[]> {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(
    `${API_URL}/api/manufacturing/product-components/`,
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
    throw new Error("Failed to fetch product components");
  }

  return response.json();
}

export async function fetchProductComponent(
  id: number
): Promise<ProductComponent> {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(
    `${API_URL}/api/manufacturing/product-components/${id}/`,
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
    throw new Error("Failed to fetch product component");
  }

  return response.json();
}

export async function createProductComponent(
  data: Omit<ProductComponent, "id">
): Promise<ProductComponent> {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;
  // Extract the token value from the raw cookie string.
  // This regex looks for `csrftoken=` followed by a group of non-semicolon characters.
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;

  console.log(data);

  const response = await fetch(
    `${API_URL}/api/manufacturing/product-components/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken || "",
        Cookie: `sessionid=${sessionid}${
          csrftoken ? `; csrftoken=${csrftoken}` : ""
        }`,
      },
      body: JSON.stringify(data),
    }
  );

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to create product component");
  }

  return response.json();
}

export async function updateProductComponent(
  id: number,
  data: Partial<ProductComponent>
): Promise<ProductComponent> {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;
  // Extract the token value from the raw cookie string.
  // This regex looks for `csrftoken=` followed by a group of non-semicolon characters.
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;

  const response = await fetch(
    `${API_URL}/api/manufacturing/product-components/${id}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken || "",
        Cookie: `sessionid=${sessionid}${
          csrftoken ? `; csrftoken=${csrftoken}` : ""
        }`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update product component");
  }

  return response.json();
}

export async function deleteProductComponent(id: number): Promise<void> {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(
    `${API_URL}/api/manufacturing/product-components/${id}/`,
    {
      method: "DELETE",
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
    throw new Error("Failed to delete product component");
  }
}
