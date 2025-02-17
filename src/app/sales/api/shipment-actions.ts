import {
  Shipment,
  ShipmentMetrics,
  ShipmentPerformanceMetrics,
} from "../types";

const SHIPMENTS_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shipments`;

export async function fetchOrderShipments(orderId: string): Promise<{
  shipments: Shipment[];
  metrics: ShipmentMetrics;
}> {
  const response = await fetch(
    `${SHIPMENTS_API}/order_shipments/?order_id=${orderId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch order shipments");
  }

  return response.json();
}

export async function fetchShipmentPerformanceMetrics(): Promise<ShipmentPerformanceMetrics> {
  const response = await fetch(`${SHIPMENTS_API}/performance_metrics/`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch shipment performance metrics");
  }

  return response.json();
}

export async function updateShipmentStatus(
  shipmentId: string,
  status: string
): Promise<Shipment> {
  const response = await fetch(`${SHIPMENTS_API}/${shipmentId}/status/`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update shipment status");
  }

  return response.json();
}

export async function updateShipmentTracking(
  shipmentId: string,
  data: {
    tracking_number?: string;
    carrier?: string;
    carrier_service?: string;
    estimated_delivery_date?: string;
  }
): Promise<Shipment> {
  const response = await fetch(`${SHIPMENTS_API}/${shipmentId}/tracking/`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update shipment tracking");
  }

  return response.json();
}

export async function markShipmentDelivered(
  shipmentId: string,
  data: {
    actual_delivery_date: string;
    delivery_status?: string;
  }
): Promise<Shipment> {
  const response = await fetch(`${SHIPMENTS_API}/${shipmentId}/delivered/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to mark shipment as delivered");
  }

  return response.json();
}
