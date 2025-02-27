// File: inventory_types.ts

import { Customer, User } from "./core";
import { BOMProcessConfig } from "./manufacture";

export type TutucuType =
  | "pens"
  | "hidrolik"
  | "veldon"
  | "rulmanli"
  | "tarama"
  | "shrink";

export interface TutucuProduct {
  id: number;
  stock_kodu: string;
  konum: string;
  tutucuType: TutucuType;
  description?: string;
  tedarikci_adi?: string;
  tedarikci_urun_kodu?: string;
  birim_fiyati?: number;
}

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
  created_at: string;
  modified_at: string;
  inventory_category?: number;
  inventory_category_display?: string; // Added this field
  technical_drawings?: TechnicalDrawing[];
}

export interface ProcessProduct {
  id: number;
  product_code: string;
  parent_product: number;
  parent_product_details: Product;
  description?: string;
  current_stock: number;
  bom_process_config: number;
  bom_process_config_details: BOMProcessConfig;
}

export interface TechnicalDrawing {
  id: number;
  version: string;
  drawing_code: string;
  drawing_file?: string;
  drawing_url?: string; // Added this field
  effective_date: string;
  is_current: boolean;
  revision_notes?: string;
  created_at: string;
  updated_at: string;
}

// The API endpoints for technical drawings will be available at:
// List/Create: /api/inventory/technical-drawings/
// Detail/Update/Delete: /api/inventory/technical-drawings/<id>/
// And you can filter technical drawings using query parameters:
// By product: /api/inventory/technical-drawings/?product=1
// By current version: /api/inventory/technical-drawings/?is_current=true
// Let me know if you need any clarification or run into other issues!

export type MaterialType = "STEEL" | "ALUMINUM";

// Updated Raw Material interface with new fields
export interface RawMaterial {
  id: number;
  material_code: string;
  material_name: string;
  current_stock: number;
  unit: UnitOfMeasure;
  inventory_category?: InventoryCategory;

  // New field for material type with enum-like choices
  material_type: MaterialType;

  // New fields for dimensions / measurements
  width?: number | null;
  height?: number | null;
  thickness?: number | null;
  diameter_mm?: number | null;
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
