import { Customer } from "@/types/core";
import { Product } from "@/types/inventory";
import { User } from "@/types/user";

export type SalesOrderStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "CANCELLED"
  | "COMPLETED";

export type ShipmentStatus =
  | "PENDING"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED";

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
  shipping_amount: string;
  shipping_note: string | null;

  status: ShipmentStatus;
  status_display: string;
  delivery_status: string;
  transit_time: number | null;

  tracking_number: string | null;
  estimated_delivery_date: string | null;
  actual_delivery_date: string | null;

  carrier: string | null;
  carrier_service: string | null;

  package_weight: string | null;
  package_length: string | null;
  package_width: string | null;
  package_height: string | null;

  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_country: string | null;
  shipping_postal_code: string | null;

  is_insured: boolean;
  insurance_amount: string | null;
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
}

export interface ShipmentMetrics {
  total_shipments: number;
  delivered_shipments: number;
  on_time_deliveries: number;
  total_amount: string;
}

export interface ShipmentPerformanceMetrics {
  total_shipments: number;
  delivered_shipments: number;
  on_time_delivery_rate: number;
  average_transit_time_days: number;
  status_breakdown: {
    status: string;
    count: number;
  }[];
}
