"use server";

import { Shipment } from "@/app/sales/types";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to get cookies and headers
export async function getAuthHeaders() {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;
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

export async function createShipment(data: {
  shipping_date: string;
  shipping_amount: number;
  order: string;
  shipping_note?: string;
}): Promise<Shipment> {
  const response = await fetch(`${API_URL}/api/sales/shipments/`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to create shipment");
  }

  return response.json();
}

export async function fetchShipment(shippingNo: string): Promise<Shipment> {
  const response = await fetch(
    `${API_URL}/api/sales/shipments/${shippingNo}/`,
    {
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shipment");
  }

  return response.json();
}
