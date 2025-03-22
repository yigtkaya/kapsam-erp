"use server";

import { ProcessConfig } from "@/types/manufacture";
import { revalidatePath } from "next/cache";
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

// /api/manufacturing/workflows/2/configs/
export async function fetchProcessConfigsForWorkflow(
  workflowId: number
): Promise<ProcessConfig[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/workflows/${workflowId}/configs/`,
    {
      headers,
    }
  );

  console.log(response);

  if (!response.ok) {
    console.log(await response.json());

    throw new Error("Failed to fetch process configs");
  }

  return await response.json();
}
// Process Config API functions
export async function fetchProcessConfigs(): Promise<ProcessConfig[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/process-configs/`,
    {
      headers,
    }
  );

  console.log(response);

  if (!response.ok) {
    console.log(await response.json());

    throw new Error("Failed to fetch process configs");
  }

  return await response.json();
}

export async function fetchProcessConfig(id: number): Promise<ProcessConfig> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/process-configs/${id}/`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch process config");
  }

  return await response.json();
}

export async function createProcessConfig(
  data: Omit<ProcessConfig, "id" | "created_at" | "updated_at">
) {
  const headers = await getAuthHeaders();

  console.log("Creating process config:", data);

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/process-configs/`,
      {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(data),
      }
    );

    console.log("Response:", response);

    if (!response.ok) {
      console.log(await response.json());
      throw new Error("Failed to create process config");
    }

    revalidatePath("/manufacturing/process-configs");
    return await response.json();
  } catch (error) {
    console.error("Error creating process config:", error);
    throw error;
  }
}

export async function updateProcessConfig(
  id: number,
  data: Partial<ProcessConfig>
) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/process-configs/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update process config");
    }

    revalidatePath("/manufacturing/process-configs");
    return await response.json();
  } catch (error) {
    console.error("Error updating process config:", error);
    throw error;
  }
}

export async function deleteProcessConfig(id: number) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/process-configs/${id}/`,
      {
        method: "DELETE",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete process config");
    }

    revalidatePath("/manufacturing/process-configs");
    return true;
  } catch (error) {
    console.error("Error deleting process config:", error);
    throw error;
  }
}

export async function activateProcessConfig(id: number) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/process-configs/${id}/activate/`,
      {
        method: "POST",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to activate process config");
    }

    revalidatePath("/manufacturing/process-configs");
    return await response.json();
  } catch (error) {
    console.error("Error activating process config:", error);
    throw error;
  }
}

export async function createNewProcessConfigVersion(id: number) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/process-configs/${id}/create-new-version/`,
      {
        method: "POST",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create new process config version");
    }

    revalidatePath("/manufacturing/process-configs");
    return await response.json();
  } catch (error) {
    console.error("Error creating new process config version:", error);
    throw error;
  }
}
