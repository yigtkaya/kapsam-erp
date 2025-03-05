"use server";

import { Holder } from "@/types/inventory";
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

export async function fetchHolders(): Promise<Holder[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/inventory/holders/`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch holders");
  }

  return response.json();
}

export async function createHolder(data: Holder) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/inventory/holders/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create holder");
  }

  return response.json();
}

export async function updateHolder(id: number, data: Holder) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/inventory/holders/${id}/`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update holder");
  }

  return response.json();
}

export async function deleteHolder(id: number) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/inventory/holders/${id}/`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to delete holder");
  }

  return response.json();
}
