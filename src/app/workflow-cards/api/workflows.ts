"use server";

import { ProductWorkflow } from "@/types/manufacture";
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

// Workflow API functions
export async function fetchWorkflows(): Promise<ProductWorkflow[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/manufacturing/workflows/`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch workflows");
  }

  return await response.json();
}

export async function fetchWorkflow(id: number): Promise<ProductWorkflow> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/workflows/${id}/`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch workflow");
  }

  return await response.json();
}

export async function createWorkflow(
  data: Omit<ProductWorkflow, "id" | "created_at" | "updated_at">
) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(`${API_URL}/api/manufacturing/workflows/`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create workflow");
    }

    revalidatePath("/manufacturing/workflows");
    return await response.json();
  } catch (error) {
    console.error("Error creating workflow:", error);
    throw error;
  }
}

export async function updateWorkflow(
  id: number,
  data: Partial<ProductWorkflow>
) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/workflows/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update workflow");
    }

    revalidatePath("/manufacturing/workflows");
    return await response.json();
  } catch (error) {
    console.error("Error updating workflow:", error);
    throw error;
  }
}

export async function deleteWorkflow(id: number) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/workflows/${id}/`,
      {
        method: "DELETE",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete workflow");
    }

    revalidatePath("/manufacturing/workflows");
    return true;
  } catch (error) {
    console.error("Error deleting workflow:", error);
    throw error;
  }
}

export async function activateWorkflow(id: number) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/workflows/${id}/activate/`,
      {
        method: "POST",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to activate workflow");
    }

    revalidatePath("/manufacturing/workflows");
    return await response.json();
  } catch (error) {
    console.error("Error activating workflow:", error);
    throw error;
  }
}

export async function createNewWorkflowVersion(id: number) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/workflows/${id}/create-new-version/`,
      {
        method: "POST",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create new workflow version");
    }

    revalidatePath("/manufacturing/workflows");
    return await response.json();
  } catch (error) {
    console.error("Error creating new workflow version:", error);
    throw error;
  }
}

export async function createWorkflowWithConfigs(data: {
  product: number;
  version: string;
  status: string;
  notes: string;
  process_configs: Array<{
    process: number;
    version: string;
    status: string;
    sequence_order: number;
    stock_code: string;
    tool?: string;
    control_gauge?: string;
    fixture?: string;
    axis_count: string;
    machine_time: number;
    setup_time: number;
    net_time: number;
    number_of_bindings: number;
    description: string;
  }>;
}) {
  const headers = await getAuthHeaders();

  console.log(data);

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/workflows/create_with_configs/`,
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
      throw new Error("Failed to create workflow with configs");
    }

    revalidatePath("/workflow-cards");
    return await response.json();
  } catch (error) {
    console.error("Error creating workflow with configs:", error);
    throw error;
  }
}
