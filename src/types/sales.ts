import { Product } from "./inventory";
import { Customer } from "./core";
import { User } from "./user";

export type SalesOrderStatus = "OPEN" | "CLOSED";

// {
//   "id": 3,
//   "product": 59,
//   "product_details": {
//       "id": 59,
//       "product_code": "03.0.00.0003.00.00.00",
//       "product_name": "KCR DİPÇİK TÜPÜ BAĞLAMA SOMUNU",
//       "product_type": "SINGLE",
//       "description": null,
//       "current_stock": 79,
//       "multicode": null,
//       "project_name": null,
//       "inventory_category": 3,
//       "inventory_category_display": "Mamül",
//       "technical_drawings": [],
//       "created_at": "2025-03-08T18:18:14.913363Z",
//       "modified_at": "2025-03-08T18:18:14.913364Z",
//       "in_process_quantity_by_process": {}
//   },
//   "ordered_quantity": 21,
//   "fulfilled_quantity": 0,
//   "receiving_date": "2025-02-24",
//   "deadline_date": "2025-03-13",
//   "kapsam_deadline_date": "2025-03-23"
// }

export interface SalesOrderItem {
  id: number;
  order_number: string;
  product: number;
  product_details?: Product;
  ordered_quantity: number;
  fulfilled_quantity: number;
  receiving_date: string | null;
  deadline_date: string;
  kapsam_deadline_date: string | null;
}

export interface SalesOrder {
  id: string;
  order_number: string;
  customer: number;
  customer_name: string;
  created_at: string;
  approved_by: string | null;
  status: SalesOrderStatus;
  status_display: string;
  items: SalesOrderItem[];
  shipments: Shipping[];
}

export interface Shipping {
  id: string;
  shipping_no: string;
  shipping_date: string;
  order: string;
  order_item: number;
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
  order_item: number;
  quantity: number;
  package_number: number;
  shipping_note?: string;
}

export interface UpdateShipmentStatusRequest {
  status: "OPEN" | "CLOSED";
  tracking_number?: string;
  estimated_delivery_date?: string;
}

export interface CreateSalesOrderRequest {
  order_number: string;
  customer: number;
  status: SalesOrderStatus;
  items: Omit<SalesOrderItem, "id" | "sales_order" | "product_details">[];
}
