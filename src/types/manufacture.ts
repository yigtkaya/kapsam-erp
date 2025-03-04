import { ProcessProduct, Product, RawMaterial } from "./inventory";

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
  NONE = "Yok",
}

export enum ProductType {
  STANDARD_PART = "STANDARD",
  MONTAGED = "MONTAGED",
  SEMI = "SEMI",
  SINGLE = "SINGLE",
}

export enum MachineStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  MAINTENANCE = "MAINTENANCE",
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
  machine_name: string;
  machine_type: MachineType;
  brand?: string;
  model?: string;
  axis_count?: AxisCount;
  internal_cooling?: number | null;
  motor_power_kva?: number | null;
  holder_type?: string;
  spindle_motor_power_10_percent_kw?: number | null;
  spindle_motor_power_30_percent_kw?: number | null;
  power_hp?: number | null;
  spindle_speed_rpm?: number | null;
  tool_count?: number | null;
  nc_control_unit?: string;
  manufacturing_year: string | null;
  serial_number?: string;
  machine_weight_kg?: number | null;
  max_part_size?: string;
  description?: string;
  status: MachineStatus;
  maintenance_interval: number;
  last_maintenance_date: Date | null;
  next_maintenance_date: Date | null;
  maintenance_notes?: string;
  category_display?: string;
}

export interface ManufacturingProcess extends BaseModel {
  process_code: string;
  process_name: string;
  standard_time_minutes: number;
  machine_type: MachineType | null;
  approved_by?: number; // User ID
}

export interface BOMResponse extends BaseModel {
  product: Product;
  version: string;
  is_active: boolean;
  is_approved: boolean;
  approved_by: number | null;
  approved_at: string | null;
  parent_bom: number | null;
  notes: string | null;
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

export interface BOMComponent extends BaseModel {
  bom: number; // BOM ID
  sequence_order: number;
  quantity?: number | string;
  notes?: string;
  component_type: "Product Component" | "Process Component";
  process_component?: ProcessComponent;
  product_component?: ProductComponent;
}

export interface ProductComponent extends BOMComponent {
  id: number;
  bom: number;
  sequence_order: number;
  quantity: number | string;
  notes: string;
  product: Product;
  active_bom_id: number | null;
}

//             {
//   "id": 12,
//   "bom": 10,
//   "sequence_order": 3,
//   "quantity": null,
//   "notes": "",
//   "component_type": "Process Component",
//   "process_component": {
//       "id": 12,
//       "bom": 10,
//       "sequence_order": 3,
//       "quantity": null,
//       "notes": "",
//       "process_config": {
//           "id": 1,
//           "process": 3,
//           "process_name": "Malzeme Girişi",
//           "process_code": "OP10",
//           "machine_type": "İşleme Merkezi",
//           "axis_count": "8.5EKSEN",
//           "estimated_duration_minutes": 1,
//           "tooling_requirements": null,
//           "quality_checks": null
//       },
//       "raw_material": null
//   },
//   "product_component": null
// }

export interface BOMProcessConfig extends BaseModel {
  process: number; // Process ID
  axis_count?: AxisCount;
  process_name: string;
  process_code: string;
  machine_type: MachineType;
  estimated_duration_minutes?: number;
  tooling_requirements?: string;
  quality_checks?: string;
  raw_material_details: RawMaterial;
  process_product_details: ProcessProduct | null;
  process_product: number | null;
}

export interface ProcessComponent extends BOMComponent {
  process_config: BOMProcessConfig; // BOMProcessConfig ID
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
