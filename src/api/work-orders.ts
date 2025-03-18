"use server";
import { WorkOrder } from "@/types/manufacture";
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

// Work Order API functions
export async function fetchWorkOrder(id: number): Promise<WorkOrder> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/work-orders/${id}/`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch work order");
  }

  return await response.json();
}

export async function fetchWorkOrders(): Promise<WorkOrder[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/manufacturing/work-orders/`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch work orders");
  }

  return await response.json();
}

export async function createWorkOrder(
  data: Omit<WorkOrder, "id" | "created_at" | "updated_at">
) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(`${API_URL}/api/manufacturing/work-orders/`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create work order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating work order:", error);
    throw error;
  }
}

export async function updateWorkOrder(id: number, data: Partial<WorkOrder>) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/work-orders/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update work order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating work order:", error);
    throw error;
  }
}

export async function deleteWorkOrder(id: number) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/work-orders/${id}/`,
      {
        method: "DELETE",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete work order");
    }

    return true;
  } catch (error) {
    console.error("Error deleting work order:", error);
    throw error;
  }
}
