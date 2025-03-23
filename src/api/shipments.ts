"use server";

import { Shipping, CreateShipmentRequest } from "@/types/sales";
import { fetchApi, postApi, updateApi, deleteApi } from "./api-helpers";

export async function fetchShipment(shippingNo: string): Promise<Shipping> {
  return fetchApi<Shipping>(`/api/sales/shipments/${shippingNo}/`);
}

export async function fetchShipments(orderId: string): Promise<Shipping[]> {
  return fetchApi<Shipping[]>(`/api/sales/orders/${orderId}/shipments/`);
}

export interface BatchUpdateShipmentRequest {
  shipments: Array<{
    shipping_no: string;
    quantity: number;
    shipping_date: string;
    shipping_note?: string;
  }>;
}

export async function batchUpdateShipments(
  orderId: string,
  data: BatchUpdateShipmentRequest
): Promise<Shipping[]> {
  return updateApi<Shipping[]>(
    `/api/sales/orders/${orderId}/shipments/batch-update/`,
    data
  );
}

/**
 * Interface for creating a shipment using the create-shipment endpoint
 */
export interface CreateOrderShipmentPayload {
  shipping_no: string;
  shipping_date: string;
  order_item: number;
  quantity: number;
  package_number?: number;
  shipping_note?: string;
}

/**
 * Create a shipment for a specific order
 * @param orderId - The ID of the sales order
 * @param data - The shipment data
 */
export async function createOrderShipment(
  orderId: string,
  data: CreateOrderShipmentPayload
): Promise<Shipping> {
  return postApi<Shipping>(
    `/api/sales/orders/${orderId}/create-shipment/`,
    data
  );
}

/**
 * Delete a specific shipment from a sales order
 * @param orderId - The ID of the sales order
 * @param shippingNo - The shipping number to delete
 */
export async function deleteOrderShipment(
  orderId: string,
  shippingNo: string
): Promise<void> {
  return deleteApi(`/api/sales/orders/${orderId}/shipments/${shippingNo}/`);
}
