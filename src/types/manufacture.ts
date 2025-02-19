import { Product, RawMaterial } from "./inventory";

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
  brand: string;
  model: string;
  axis_count?: AxisCount;
  internal_cooling: number | null;
  motor_power_kva: number | null;
  holder_type: string;
  spindle_motor_power_10_percent_kw: number | null;
  spindle_motor_power_30_percent_kw: number | null;
  power_hp: number | null;
  spindle_speed_rpm: number | null;
  tool_count: number | null;
  nc_control_unit: string;
  manufacturing_year: string | null;
  machine_weight_kg: number | null;
  max_part_size: string;
  description: string;
  status: MachineStatus;
  maintenance_interval: number;
  serial_number: null;
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
  process: string; // ManufacturingProcess ID
  machine_type: MachineType;
  estimated_duration_minutes: number;
  tooling_requirements?: Record<string, unknown>;
  quality_checks?: Record<string, unknown>;
}

export interface BOM {
  id: string;
  product: string; // Product ID
  version: string;
  is_active: boolean;
  created_at: Date;
  modified_at: Date;
  components: BOMComponent[] | null;
}

export type BOMComponentType =
  | "PROCESS"
  | "SEMI"
  | "MONTAGED"
  | "STANDARD"
  | "RAW";

export interface BOMComponent {
  id: string;
  bom: string; // BOM ID
  component_type: BOMComponentType;
  sequence_order: number;
  process?: string; // ManufacturingProcess ID
  process_config?: string; // BOMProcessConfig ID
  product?: string; // Product ID (SEMI/MONTAGED)
  standard_part?: string; // Product ID (STANDARD)
  raw_material?: string; // RawMaterial ID
  quantity: number;
  notes?: string;
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
  parent_work_order: string; // WorkOrder ID
  bom_component: string; // BOMComponent ID
  quantity: number;
  planned_start: Date;
  planned_end: Date;
  actual_start?: Date;
  actual_end?: Date;
  status: WorkOrderStatus;
  output_quantity?: number;
  scrap_quantity: number;
  target_category?: string; // InventoryCategory ID
  notes?: string;
  processes: SubWorkOrderProcess[];
}

export interface SubWorkOrderProcess {
  id: string;
  sub_work_order: string; // SubWorkOrder ID
  process: string; // ManufacturingProcess ID
  machine: string; // Machine ID
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
