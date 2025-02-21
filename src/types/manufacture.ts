import { Product, ProductType, RawMaterial } from "./inventory";

// MachineStatus enum
export enum MachineStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  MAINTENANCE = "MAINTENANCE",
  RETIRED = "RETIRED",
}

// WorkOrderStatus choices
export type WorkOrderStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DELAYED";

// Enums
export enum AxisCount {
  NINE_AXIS = "9 EKSEN",
  EIGHT_POINT_FIVE_AXIS = "8.5 EKSEN",
  FIVE_AXIS = "5 EKSEN",
  FOUR_AXIS = "4 EKSEN",
  THREE_AXIS = "3 EKSEN",
  TWO_AXIS = "2 EKSEN",
  ONE_AXIS = "1 EKSEN",
}

export enum MachineType {
  PROCESSING_CENTER = "İşleme Merkezi",
  CNC_TORNA = "CNC Torna Merkezi",
  CNC_KAYAR_OTOMAT = "CNC Kayar Otomat",
}

// Interfaces
export interface Machine {
  id?: string;
  machine_code: string;
  machine_type: MachineType;
  brand: string | null;
  model: string | null;
  axis_count?: AxisCount;
  internal_cooling: number | null;
  motor_power_kva: number | null;
  holder_type: string | null;
  spindle_motor_power_10_percent_kw: number | null;
  spindle_motor_power_30_percent_kw: number | null;
  power_hp: number | null;
  spindle_speed_rpm: number | null;
  tool_count: number | null;
  nc_control_unit: string | null;
  manufacturing_year: Date | null;
  machine_weight_kg: number | null;
  max_part_size: string | null;
  description: string | null;
  status: MachineStatus;
  maintenance_interval: number;
  serial_number: string | null;
  last_maintenance_date: Date | null;
  next_maintenance_date: Date | null;
  maintenance_notes: string | null;
}

export interface ManufacturingProcess {
  id: string;
  process_code: string;
  process_name: string;
  standard_time_minutes: number;
  machine_type: MachineType;
  approved_by?: string; // User ID
}

export interface BOMProcessConfig {
  id: string;
  process: string;
  axis_count?: AxisCount;
  estimated_duration_minutes: number;
  tooling_requirements?: Record<string, unknown>;
  quality_checks?: Record<string, unknown>;
}

export interface BOM {
  id: number;
  product: string;
  version: string;
  is_active: boolean;
  created_at: Date;
  modified_at: Date;
  components: BOMComponent[];
  product_type: ProductType;
}

export type BOMComponentType = "PRODUCT" | "PROCESS";

export interface BOMComponent {
  id: string;
  bom: string;
  component_type: BOMComponentType;
  sequence_order: number;
  quantity: number;
  notes?: string;
  // Product-specific fields
  product?: string;
  // Process-specific fields
  process_config?: string;
  raw_material?: string;
}

export interface WorkOrder {
  id: string;
  order_number: string;
  sales_order_item: string; // SalesOrderItem ID
  bom: string; // BOM ID
  quantity: number;
  planned_start: Date;
  planned_end: Date;
  actual_start?: Date;
  actual_end?: Date;
  status: WorkOrderStatus;
  priority: number;
  notes?: string;
  sub_orders: SubWorkOrder[];
}

export interface SubWorkOrder {
  id: string;
  parent_work_order: string;
  bom_component: string;
  quantity: number;
  planned_start: Date;
  planned_end: Date;
  actual_start?: Date;
  actual_end?: Date;
  status: WorkOrderStatus;
  output_quantity?: number;
  scrap_quantity: number;
  target_category?: string;
  notes?: string;
  processes: SubWorkOrderProcess[];
}

export interface SubWorkOrderProcess {
  id: string;
  sub_work_order: string;
  process: string;
  machine: string;
  sequence_order: number;
  planned_duration_minutes: number;
  actual_duration_minutes?: number;
}

export type WorkOrderOutputStatus = "GOOD" | "REWORK" | "SCRAP";

export interface WorkOrderOutput {
  id: string;
  sub_work_order: string; // SubWorkOrder ID
  quantity: number;
  status: WorkOrderOutputStatus;
  target_category: string; // InventoryCategory ID
  notes?: string;
}

// Validation Types
export interface WorkOrderOutputValidation {
  isValid: boolean;
  errors: {
    status?: string;
    quantity?: string;
  };
}

// Helper Types
export interface BOMComponentRelations {
  process?: ManufacturingProcess;
  process_config?: BOMProcessConfig;
  product?: Product;
  standard_part?: Product;
  raw_material?: RawMaterial;
}
