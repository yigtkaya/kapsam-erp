"use server";

import { CreateShipmentRequest, SalesOrderItem } from "@/types/sales";

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
  return responseData;
};

export const getSalesOrder = async (orderId: string) => {
  const response = await fetch(`${API_URL}/api/sales/orders/${orderId}/`, {
    method: "GET",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sales order");
  }

  const responseData = await response.json();
  return responseData;
};

export const createSalesOrder = async (data: {
  customer: number;
  deadline_date: string;
  order_receiving_date: string;
  kapsam_deadline_date: string;
  status: string;
  items: {
    product: number;
    quantity: number;
  }[];
}) => {
  console.log(data);
  const response = await fetch(`${API_URL}/api/sales/orders/`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  console.log(response);

  if (!response.ok) {
    console.log(await response.json());
    console.log(response.statusText);
    console.log(response.status);
    throw new Error("Failed to create sales order");
  }

  const responseData = await response.json();
  console.log(responseData);
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

  return response;
};

export const updateSalesOrder = async (
  orderId: string,
  data: Partial<{
    deadline_date: string;
    status: string;
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
    const response = await fetch(`${API_URL}/api/sales/shipments/`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

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

export const deleteShipment = async (shipmentId: string) => {
  const response = await fetch(
    `${API_URL}/api/sales/shipments/${shipmentId}/`,
    {
      method: "DELETE",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    console.log(await response.json());
    console.log(response.statusText);
    console.log(response.status);
    throw new Error("Failed to delete shipment");
  }

  return response;
};
