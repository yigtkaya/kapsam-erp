import { Product } from "./inventory";

// Enums
export enum AxisCount {
  NINE_AXIS = "9EKSEN",
  EIGHT_POINT_FIVE_AXIS = "8.5EKSEN",
  FIVE_AXIS = "5EKSEN",
  FOUR_AXIS = "4EKSEN",
  THREE_AXIS = "3EKSEN",
  TWO_AXIS = "2EKSEN",
  ONE_AXIS = "1EKSEN",
}

export enum MachineType {
  PROCESSING_CENTER = "İşleme Merkezi",
  CNC_TORNA = "CNC Torna Merkezi",
  CNC_KAYAR_OTOMAT = "CNC Kayar Otomat",
}

export enum ProductType {
  STANDARD_PART = "STANDARD",
  MONTAGED = "MONTAGED",
  SEMI = "SEMI",
  SINGLE = "SINGLE",
}

export enum MachineStatus {
  AVAILABLE = "AVAILABLE",
  // Add other statuses as needed
}

export enum WorkOrderStatus {
  PLANNED = "PLANNED",
  // Add other statuses as needed
}

// Base interface for common fields
export interface BaseModel {
  id: number;
  created_at: string;
  updated_at: string;
}

// Main interfaces
export interface Machine extends BaseModel {
  machine_code: string;
  machine_type: MachineType;
  brand?: string;
  model?: string;
  axis_count?: AxisCount;
  internal_cooling?: number;
  motor_power_kva?: number;
  holder_type?: string;
  spindle_motor_power_10_percent_kw?: number;
  spindle_motor_power_30_percent_kw?: number;
  power_hp?: number;
  spindle_speed_rpm?: number;
  tool_count?: number;
  nc_control_unit?: string;
  manufacturing_year?: string;
  serial_number?: string;
  machine_weight_kg?: number;
  max_part_size?: string;
  description?: string;
  status: MachineStatus;
  maintenance_interval: number;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  maintenance_notes?: string;
}

export interface ManufacturingProcess extends BaseModel {
  process_code: string;
  process_name: string;
  standard_time_minutes: number;
  machine_type: MachineType;
  approved_by?: number; // User ID
}

export interface BOMProcessConfig extends BaseModel {
  process: number; // Process ID
  axis_count?: AxisCount;
  estimated_duration_minutes?: number;
  tooling_requirements?: Record<string, any>;
  quality_checks?: Record<string, any>;
}

export interface BOMResponse extends BaseModel {
  product: Product;
  version: string;
  is_active: boolean;
  components?: BOMComponent[];
  created_at: string;
  modified_at: string;
}

export interface BOMRequest extends BaseModel {
  product: string;
  version: string;
  is_active: boolean;
  components?: BOMComponent[];
}

export type BOM = BOMResponse;

export interface BOMComponent extends BaseModel {
  bom: number; // BOM ID
  sequence_order: number;
  quantity?: number;
  notes?: string;
  component_type: "PRODUCT" | "PROCESS";
  details: ProductComponentDetails | ProcessComponentDetails;
}

export interface ProductComponentDetails {
  type: "PRODUCT";
  product: {
    id: number;
    product_code: string;
    name: string;
    product_type: ProductType;
  };
}

export interface ProcessComponentDetails {
  type: "PROCESS";
  process_config: {
    id: number;
    process_name: string;
    process_code: string;
    machine_type: MachineType;
    axis_count?: AxisCount;
    estimated_duration_minutes?: number;
  };
  raw_material?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface ProductComponent extends BOMComponent {
  product: string; // Product Code
}

export interface ProcessComponent extends BOMComponent {
  process_config: number; // BOMProcessConfig ID
  raw_material?: number; // RawMaterial ID
}

export interface WorkOrder extends BaseModel {
  order_number: string;
  sales_order_item: number;
  bom: number;
  quantity: number;
  planned_start: string;
  planned_end: string;
  actual_start?: string;
  actual_end?: string;
  status: WorkOrderStatus;
  priority: number;
  notes?: string;
}

export interface WorkOrderOutput extends BaseModel {
  sub_work_order: number;
  quantity: number;
  status: "GOOD" | "REWORK" | "SCRAP" | "QUARANTINE";
  target_category: number;
  notes?: string;
  quarantine_reason?: string;
  inspection_required: boolean;
}
