import { Customer } from "@/types/core";
import { Product } from "@/types/inventory";
import { User } from "@/types/user";

export type SalesOrderStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "CANCELLED"
  | "COMPLETED";

export interface SalesOrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  fulfilled_quantity: number;
}

export interface Shipment {
  id: string;
  shipping_no: string;
  shipping_date: string;
  shipping_amount: number;
  order: string;
  shipping_note?: string;
}

export interface SalesOrder {
  id: string;
  order_number: string;
  customer: number;
  customer_name: string;
  order_date: string;
  deadline_date: string;
  status: SalesOrderStatus;
  status_display: string;
  approved_by: number | null;
  total_shipped_amount: number;
  items: SalesOrderItem[];
  shipments: Shipment[];
}

export interface CreateSalesOrderDTO {
  customer: number;
  deadline_date: string;
  items: {
    product: number;
    quantity: number;
  }[];
}

export interface UpdateSalesOrderDTO {
  deadline_date?: string;
  status?: SalesOrderStatus;
  order_receiving_date?: string;
  kapsam_deadline_date?: string;
}
