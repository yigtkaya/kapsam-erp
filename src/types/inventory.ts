// File: inventory_types.ts

import { Customer, User } from "./core";

// Inventory Category type definitions
export type InventoryCategoryName =
  | "HAMMADDE"
  | "PROSES"
  | "MAMUL"
  | "KARANTINA"
  | "HURDA"
  | "TAKIMHANE";

export interface InventoryCategory {
  id: number;
  name: InventoryCategoryName;
  description?: string;
}

// Unit of Measure
export interface UnitOfMeasure {
  id: number;
  unit_code: string;
  unit_name: string;
}

// Product and Customer types
export type ProductType = "SINGLE" | "SEMI" | "MONTAGED" | "STANDARD_PART";

export interface Product {
  id: number;
  product_code: string;
  product_name: string;
  product_type: ProductType;
  description?: string;
  current_stock: number;
  customer?: Customer;
  inventory_category?: InventoryCategory;
}

// Technical Drawing
export interface TechnicalDrawing {
  id: number;
  product: Product;
  version: string;
  drawing_code: string;
  drawing_url: string;
  effective_date: string; // ISO formatted date string
  is_current: boolean;
  revision_notes?: string;
  approved_by?: User;
}

// Raw Material
export interface RawMaterial {
  id: number;
  material_code: string;
  material_name: string;
  current_stock: number;
  unit: UnitOfMeasure;
  inventory_category?: InventoryCategory;
}

// Inventory Transaction types
export type TransactionType = "IN" | "OUT" | "ADJUST" | "RETURN" | "TRANSFER";

export interface InventoryTransaction {
  id: number;
  product?: Product;
  material?: RawMaterial;
  quantity_change: number;
  transaction_type: TransactionType;
  transaction_date: string; // ISO formatted datetime string
  performed_by: User;
  verified_by?: User;
  notes?: string;
  from_category?: InventoryCategory;
  to_category?: InventoryCategory;
  reference_id?: string;
}
