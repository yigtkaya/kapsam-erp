"use server";

import {
  BOMProcessConfig,
  Machine,
  ManufacturingProcess,
  WorkOrder,
} from "@/types/manufacture";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to get cookies and headers
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  return {
    "Content-Type": "application/json",
    "X-CSRFToken": csrftoken || "",
    Cookie: `sessionid=${sessionid}${
      csrftoken ? `; csrftoken=${csrftoken}` : ""
    }`,
  };
}

// Machine API functions
export async function fetchMachine(id: number): Promise<Machine> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/manufacturing/machines/${id}/`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch machine");
  }

  return await response.json();
}

export async function fetchMachines(): Promise<Machine[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/manufacturing/machines/`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch machines");
  }

  return await response.json();
}

export async function createMachine(
  data: Omit<Machine, "id" | "created_at" | "updated_at">
) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(`${API_URL}/api/manufacturing/machines/`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create machine");
    }

    revalidatePath("/manufacturing/machines");
    return await response.json();
  } catch (error) {
    console.error("Error creating machine:", error);
    throw error;
  }
}

export async function updateMachine(id: number, data: Partial<Machine>) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/machines/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update machine");
    }

    revalidatePath("/manufacturing/machines");
    return await response.json();
  } catch (error) {
    console.error("Error updating machine:", error);
    throw error;
  }
}

export async function deleteMachine(id: number) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(
      `${API_URL}/api/manufacturing/machines/${id}/`,
      {
        method: "DELETE",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete machine");
    }

    revalidatePath("/manufacturing/machines");
    return true;
  } catch (error) {
    console.error("Error deleting machine:", error);
    throw error;
  }
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

  try {
    const response = await fetch(`${API_URL}/api/manufacturing/processes/`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create manufacturing process");
    }

    revalidatePath("/manufacturing/processes");
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

    revalidatePath("/manufacturing/processes");
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

    revalidatePath("/manufacturing/processes");
    return true;
  } catch (error) {
    console.error("Error deleting manufacturing process:", error);
    throw error;
  }
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

    revalidatePath("/manufacturing/work-orders");
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

    revalidatePath("/manufacturing/work-orders");
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

    revalidatePath("/manufacturing/work-orders");
    return true;
  } catch (error) {
    console.error("Error deleting work order:", error);
    throw error;
  }
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
    throw new Error("Failed to fetch process configs");
  }

  return await response.json();
}

export async function fetchProcessConfig(
  id: number
): Promise<BOMProcessConfig> {
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

export async function createProcessConfig(data: BOMProcessConfig) {
  const headers = await getAuthHeaders();

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

    if (!response.ok) {
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
  data: Partial<BOMProcessConfig>
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
