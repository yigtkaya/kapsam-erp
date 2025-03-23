"use server";

import {
  CreateSalesOrderRequest,
  CreateShipmentRequest,
  SalesOrder,
  SalesOrderItem,
  SalesOrderStatus,
} from "@/types/sales";
import { fetchApi, postApi, updateApi, deleteApi } from "./api-helpers";

export async function getSalesOrders(params?: Record<string, any>) {
  const queryString = params
    ? `?${new URLSearchParams(params).toString()}`
    : "";

  return fetchApi<SalesOrder[]>(`/api/sales/orders/${queryString}`);
}

export async function getSalesOrder(orderId: string): Promise<SalesOrder> {
  return fetchApi<SalesOrder>(`/api/sales/orders/${orderId}/`);
}

export async function createSalesOrder(
  data: CreateSalesOrderRequest
): Promise<SalesOrder> {
  return postApi<SalesOrder>("/api/sales/orders/", data);
}

export async function deleteSalesOrder(orderId: string) {
  return deleteApi(`/api/sales/orders/${orderId}/`);
}

export async function updateSalesOrder(
  orderId: string,
  data: Partial<{
    status: string;
    customer: number;
  }>
) {
  return updateApi<SalesOrder>(`/api/sales/orders/${orderId}/`, data);
}

export async function createShipment(data: CreateShipmentRequest) {
  return postApi<any>("/api/sales/shipments/", data);
}

/**
 * Delete a shipment by its ID (not associated with a specific order)
 * @param shipmentId - The ID of the shipment to delete
 */
export async function deleteShipment(shipmentId: string): Promise<void> {
  return deleteApi(`/api/sales/shipments/${shipmentId}/`);
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
  return postApi<CreateOrderShipmentResponse>(
    `/api/sales/orders/${orderId}/shipments/`,
    data
  );
}

export async function createSalesOrderItem(
  orderId: string,
  data: Omit<SalesOrderItem, "id" | "product_details">
): Promise<SalesOrderItem> {
  return postApi<SalesOrderItem>(`/api/sales/orders/${orderId}/items/`, data);
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
  return updateApi<SalesOrderItem[]>(
    `/api/sales/orders/${orderId}/items/batch-update/`,
    data
  );
}

export async function deleteSalesOrderItem(
  orderId: string,
  itemId: number
): Promise<void> {
  return deleteApi(`/api/sales/orders/${orderId}/items/${itemId}/`);
}

export async function fetchSalesOrderItems(orderId: string) {
  return fetchApi<SalesOrderItem[]>(`/api/sales/orders/${orderId}/items/`);
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
  return postApi<SalesOrderItem[]>(
    `/api/sales/orders/${orderId}/items/batch-create/`,
    items
  );
}
