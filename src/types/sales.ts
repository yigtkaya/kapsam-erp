import { Product } from "./inventory";
import { Customer } from "./core";
import { User } from "./user";

export type SalesOrderStatus = "OPEN" | "CLOSED";

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
  order: string;
  order_item: string;
  quantity: number;
  package_number: number;
  shipping_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateShipmentRequest {
  shipping_no: string;
  shipping_date: string;
  order: string;
  order_item: string;
  quantity: number;
  package_number: number;
  shipping_note?: string;
}

export interface UpdateShipmentStatusRequest {
  status: "OPEN" | "CLOSED";
  tracking_number?: string;
  estimated_delivery_date?: string;
}
