import { Product } from "./inventory";
import { Customer } from "./core";
import { User } from "./user";

export type ShipmentStatus =
  | "DRAFT"
  | "PENDING"
  | "CONFIRMED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export type SalesOrderStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "CANCELLED"
  | "COMPLETED";

export interface SalesOrderItem {
  id?: number;
  sales_order: string;
  product: number;
  product_details?: Product;
  quantity: number;
  fulfilled_quantity: number;
}

export interface SalesOrder {
  id: string;
  order_number: string;
  customer: number;
  customer_name: string;
  order_date: string;
  order_receiving_date: string | null;
  deadline_date: string;
  kapsam_deadline_date: string | null;
  status: SalesOrderStatus;
  status_display: string;
  approved_by: string | null;
  items: SalesOrderItem[];
  shipments: Shipping[];
  created_at: string;
  updated_at: string;
}

export interface Shipping {
  id: string;
  shipping_no: string;
  shipping_date: string;
  shipping_amount: number;
  order: string;
  shipping_note: string | null;
  items: ShipmentItem[];
  created_at: string;
  updated_at: string;
}

export interface ShipmentItem {
  id: string;
  shipment: string;
  order_item: string;
  product: number;
  product_details?: Product;
  quantity: number;
  package_number: number;
  lot_number: string | null;
  serial_numbers: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateShipmentRequest {
  shipping_date: string;
  shipping_amount: number;
  shipping_note?: string;
  order: string;
  items: Array<{
    order_item: string;
    quantity: number;
    package_number: number;
    lot_number?: string;
    serial_numbers?: string[];
  }>;
}

export interface UpdateShipmentStatusRequest {
  status: ShipmentStatus;
  tracking_number?: string;
  estimated_delivery_date?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
