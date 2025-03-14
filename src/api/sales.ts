"use server";

import {
  CreateSalesOrderRequest,
  CreateShipmentRequest,
  SalesOrder,
  SalesOrderItem,
  SalesOrderStatus,
} from "@/types/sales";

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

export const getSalesOrders = async (params?: Record<string, any>) => {
  const queryString = params
    ? `?${new URLSearchParams(params).toString()}`
    : "";

  const response = await fetch(`${API_URL}/api/sales/orders/${queryString}`, {
    method: "GET",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sales orders");
  }

  const responseData = await response.json();
  console.log(responseData);
  return responseData;
};

export const getSalesOrder = async (orderId: string): Promise<SalesOrder> => {
  const response = await fetch(`${API_URL}/api/sales/orders/${orderId}/`, {
    method: "GET",
    headers: await getAuthHeaders(),
  });

  console.log(response);

  if (!response.ok) {
    console.log(await response.json());
    throw new Error("Failed to fetch sales order");
  }

  const responseData = await response.json();
  console.log(responseData);

  return responseData;
};

export const createSalesOrder = async (
  data: CreateSalesOrderRequest
): Promise<SalesOrder> => {
  console.log(data);
  const response = await fetch(`${API_URL}/api/sales/orders/`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  console.log(response);
  const responseData = await response.json();
  if (!response.ok) {
    console.log(responseData);
    throw new Error("Failed to create sales order");
  }

  return responseData;
};

export const deleteSalesOrder = async (orderId: string) => {
  const response = await fetch(`${API_URL}/api/sales/orders/${orderId}/`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete sales order");
  }

  // Don't return anything for 204 responses
  return;
};

export const updateSalesOrder = async (
  orderId: string,
  data: Partial<{
    status: string;
    customer: number;
  }>
) => {
  console.log(data);
  const response = await fetch(`${API_URL}/api/sales/orders/${orderId}/`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  console.log(response);

  if (!response.ok) {
    console.log(await response.json());
    console.log(response.statusText);
    console.log(response.status);
    throw new Error("Failed to update sales order");
  }

  const responseData = await response.json();
  console.log(responseData);
  return responseData;
};

export const createShipment = async (data: CreateShipmentRequest) => {
  console.log("Creating shipment with data:", data);

  try {
    const response = await fetch(
      `${API_URL}/api/sales/orders/${data.order}/shipments/`,
      {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      // Throw error with response data for better error handling
      console.log(responseData);
      throw {
        message: "Failed to create shipment",
        response: {
          status: response.status,
          data: responseData,
        },
      };
    }

    return responseData;
  } catch (error) {
    console.error("Shipment creation error:", error);
    throw error;
  }
};

export const deleteShipment = async (shipmentId: string, order_id: number) => {
  const response = await fetch(
    `${API_URL}/api/sales/orders/${order_id}/shipments/${shipmentId}/`,
    {
      method: "DELETE",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to delete shipment");
  }

  // Return true for successful deletion (204 No Content)
  return true;
};

interface CreateOrderShipmentRequest {
  shipping_date: string;
  shipping_amount: number;
  order_item: number;
  quantity: number;
  package_number: number;
  shipping_note?: string;
}

interface CreateOrderShipmentResponse {
  id: string;
  shipping_no: string;
  shipping_date: string;
  shipping_amount: number;
  order: number;
  order_item: number;
  product_details: {
    product_code: string;
    product_name: string;
    [key: string]: any;
  };
  quantity: number;
  package_number: number;
  shipping_note: string | null;
}

export const createOrderShipment = async (
  orderId: string,
  data: CreateOrderShipmentRequest
): Promise<CreateOrderShipmentResponse> => {
  const response = await fetch(
    `${API_URL}/api/sales/orders/${orderId}/create-shipment/`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    console.error("Failed to create shipment:", responseData);
    throw new Error("Failed to create shipment");
  }

  return responseData;
};

// Add new sales order item
export const createSalesOrderItem = async (
  orderId: string,
  data: Omit<SalesOrderItem, "id" | "product_details">
): Promise<SalesOrderItem> => {
  const response = await fetch(
    `${API_URL}/api/sales/orders/${orderId}/items/`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    console.error("Failed to create sales order item:", responseData);
    throw new Error("Failed to create sales order item");
  }

  return responseData;
};

// Add this type definition at the top of the file, after the imports
export interface SalesOrderItemUpdate {
  id: number;
  ordered_quantity?: number;
  deadline_date?: string;
  receiving_date?: string;
  kapsam_deadline_date?: string;
}

// Then update the function
export const updateSaleOrderItems = async (
  orderId: string,
  data: SalesOrderItemUpdate[]
) => {
  // Format the items according to the new API requirements
  const formattedItems = data.map((item) => ({
    id: item.id,
    ordered_quantity: item.ordered_quantity,
    deadline_date: item.deadline_date,
    receiving_date: item.receiving_date,
    kapsam_deadline_date: item.kapsam_deadline_date,
  }));

  // Remove undefined values from each item
  const cleanedItems = formattedItems.map((item) =>
    Object.fromEntries(
      Object.entries(item).filter(([_, value]) => value !== undefined)
    )
  );

  const requestBody = {
    items: cleanedItems,
  };

  try {
    const response = await fetch(
      `${API_URL}/api/sales/orders/${orderId}/items/batch-update/`,
      {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to update sales order items:", errorData);
      throw new Error(JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating items:", error);
    throw error;
  }
};

// Delete sales order item
export const deleteSalesOrderItem = async (
  orderId: string,
  itemId: number
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/sales/orders/${orderId}/items/${itemId}/`,
    {
      method: "DELETE",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    console.error("Failed to delete sales order item");
    throw new Error("Failed to delete sales order item");
  }
};

export const fetchSalesOrderItems = async (orderId: string) => {
  const response = await fetch(
    `${API_URL}/api/sales/orders/${orderId}/items/`,
    {
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch sales order items");
  }

  return response.json();
};

// Batch create sales order items
export const batchCreateSalesOrderItems = async (
  orderId: string,
  items: Array<
    Omit<
      SalesOrderItem,
      "id" | "product_details" | "order_id" | "fulfilled_quantity"
    >
  >
): Promise<SalesOrderItem[]> => {
  const response = await fetch(
    `${API_URL}/api/sales/orders/${orderId}/items/batch-create/`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ items }),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    console.error("Failed to batch create sales order items:", responseData);
    throw new Error(JSON.stringify(responseData));
  }

  return responseData;
};
