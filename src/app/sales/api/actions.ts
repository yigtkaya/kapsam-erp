"use server";
import { cookies } from "next/headers";
import { CreateSalesOrderDTO, SalesOrder, UpdateSalesOrderDTO } from "../types";

const SALES_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sales/sales-orders`;

export async function fetchSalesOrders(): Promise<SalesOrder[]> {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(SALES_API, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  console.log(response);
  if (!response.ok) {
    throw new Error("Failed to fetch sales orders");
  }

  const data = await response.json();
  console.log(data);
  return data;
}

export async function fetchSalesOrder(id: string): Promise<SalesOrder> {
  const response = await fetch(`${SALES_API}/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sales order");
  }

  return response.json();
}

export async function createSalesOrder(
  data: CreateSalesOrderDTO
): Promise<SalesOrder> {
  const response = await fetch(SALES_API, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create sales order");
  }

  return response.json();
}

export async function updateSalesOrder(
  id: string,
  data: UpdateSalesOrderDTO
): Promise<SalesOrder> {
  const response = await fetch(`${SALES_API}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update sales order");
  }

  return response.json();
}

export async function deleteSalesOrder(id: string): Promise<void> {
  const response = await fetch(`${SALES_API}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete sales order");
  }
}

export async function approveSalesOrder(id: string): Promise<SalesOrder> {
  const response = await fetch(`${SALES_API}/${id}/approve/`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to approve sales order");
  }

  return response.json();
}

export async function cancelSalesOrder(id: string): Promise<SalesOrder> {
  const response = await fetch(`${SALES_API}/${id}/cancel/`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to cancel sales order");
  }

  return response.json();
}
