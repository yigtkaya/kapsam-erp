"use server";

import { Product, RawMaterial } from "@/types/inventory";
import { cookies } from "next/headers";

const API_URL = "http://localhost:8000";

export const createRawMaterial = async (rawMaterial: RawMaterial) => {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(`${API_URL}/api/raw-materials/`, {
    method: "POST",
    body: JSON.stringify(rawMaterial),
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to create raw material",
    };
  }

  return response.json();
};

export const createProduct = async (product: Product) => {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(`${API_URL}/api/products/`, {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to create product",
    };
  }

  return response.json();
};
