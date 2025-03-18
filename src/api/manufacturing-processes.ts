"use server";

import { ManufacturingProcess } from "@/types/manufacture";
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

// Manufacturing Process API functions
export async function fetchProcess(id: number): Promise<ManufacturingProcess> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/manufacturing-processes/${id}/`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch manufacturing process");
  }

  return await response.json();
}

export async function fetchProcesses(): Promise<ManufacturingProcess[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/manufacturing-processes/`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch manufacturing processes");
  }

  return await response.json();
}

export async function createProcess(
  data: Omit<ManufacturingProcess, "id" | "created_at" | "updated_at">
) {
  const headers = await getAuthHeaders();

  console.log(data);

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/manufacturing-processes/`,
      {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(data),
      }
    );

    console.log(response);
    if (!response.ok) {
      console.log(await response.json());
      throw new Error("Failed to create manufacturing process");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating manufacturing process:", error);
    throw error;
  }
}

export async function updateProcess(
  id: number,
  data: Partial<ManufacturingProcess>
) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/processes/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update manufacturing process");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating manufacturing process:", error);
    throw error;
  }
}

export async function deleteProcess(id: number) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/processes/${id}/`,
      {
        method: "DELETE",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete manufacturing process");
    }

    return true;
  } catch (error) {
    console.error("Error deleting manufacturing process:", error);
    throw error;
  }
}
