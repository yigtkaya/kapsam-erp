"use server";

import { Tool } from "@/types/inventory";
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

export async function fetchTools(): Promise<Tool[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/inventory/tools/`, { headers });

  if (!response.ok) {
    throw new Error("Failed to fetch tools");
  }

  return response.json();
}

export async function fetchTool(id: number): Promise<Tool> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/inventory/tools/${id}/`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tool");
  }

  return response.json();
}

export async function createTool(data: Tool) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/inventory/tools/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create tool");
  }

  return response.json();
}

export async function updateTool(id: number, data: Tool) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/inventory/tools/${id}/`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update tool");
  }

  return response.json();
}

export async function deleteTool(id: number) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/inventory/tools/${id}/`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to delete tool");
  }

  return response.json();
}
