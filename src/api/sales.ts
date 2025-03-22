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

export async function getSalesOrders(params?: Record<string, any>) {
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
}

export async function getSalesOrder(orderId: string): Promise<SalesOrder> {
  const response = await fetch(`${API_URL}/api/sales/orders/${orderId}/`, {
    method: "GET",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sales order");
  }

  return response.json();
}

export async function createSalesOrder(
  data: CreateSalesOrderRequest
): Promise<SalesOrder> {
  const response = await fetch(`${API_URL}/api/sales/orders/`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create sales order");
  }

  return response.json();
}

export async function deleteSalesOrder(orderId: string) {
  const response = await fetch(`${API_URL}/api/sales/orders/${orderId}/`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete sales order");
  }
}

export async function updateSalesOrder(
  orderId: string,
  data: Partial<{
    status: string;
    customer: number;
  }>
) {
  const response = await fetch(`${API_URL}/api/sales/orders/${orderId}/`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update sales order");
  }

  return response.json();
}

export async function createShipment(data: CreateShipmentRequest) {
  const response = await fetch(`${API_URL}/api/sales/shipments/`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create shipment");
  }

  return response.json();
}

export async function deleteShipment(shipmentId: string, order_id: number) {
  const response = await fetch(
    `${API_URL}/api/sales/shipments/${shipmentId}/`,
    {
      method: "DELETE",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete shipment");
  }
}

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

export async function createOrderShipment(
  orderId: string,
  data: CreateOrderShipmentRequest
): Promise<CreateOrderShipmentResponse> {
  const response = await fetch(
    `${API_URL}/api/sales/orders/${orderId}/shipments/`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create order shipment");
  }

  return response.json();
}

export async function createSalesOrderItem(
  orderId: string,
  data: Omit<SalesOrderItem, "id" | "product_details">
): Promise<SalesOrderItem> {
  const response = await fetch(
    `${API_URL}/api/sales/orders/${orderId}/items/`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create sales order item");
  }

  return response.json();
}

export interface SalesOrderItemUpdate {
  id: number;
  ordered_quantity?: number;
  deadline_date?: string;
  receiving_date?: string;
  kapsam_deadline_date?: string;
}

export async function updateSaleOrderItems(
  orderId: string,
  data: SalesOrderItemUpdate[]
) {
  const response = await fetch(
    `${API_URL}/api/sales/orders/${orderId}/items/batch-update/`,
    {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    // Log the error response and throw a meaningful error
    const errorText = await response.text();
    console.error("Failed to update sale order items:", errorText);
    throw new Error(
      `Failed to update sale order items: ${response.status} ${
        response.statusText
      }. Details: ${errorText ? errorText : "No error details available"}`
    );
  }

  return response.json();
}

export async function deleteSalesOrderItem(
  orderId: string,
  itemId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/sales/orders/${orderId}/items/${itemId}/`,
    {
      method: "DELETE",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete sales order item");
  }
}

export async function fetchSalesOrderItems(orderId: string) {
  const response = await fetch(
    `${API_URL}/api/sales/orders/${orderId}/items/`,
    {
      method: "GET",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch sales order items");
  }

  return response.json();
}

export async function batchCreateSalesOrderItems(
  orderId: string,
  items: Array<
    Omit<
      SalesOrderItem,
      "id" | "product_details" | "order_id" | "fulfilled_quantity"
    >
  >
): Promise<SalesOrderItem[]> {
  const response = await fetch(
    `${API_URL}/api/sales/orders/${orderId}/items/batch-create/`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(items),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to batch create sales order items");
  }

  return response.json();
}
