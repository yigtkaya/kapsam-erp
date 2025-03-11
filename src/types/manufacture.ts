import {
  ProcessProduct,
  Product,
  RawMaterial,
  InventoryCategory,
} from "./inventory";
import { User } from "./core";

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
}

export enum WorkOrderStatus {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  DELAYED = "DELAYED",
  COMPLETED = "COMPLETED",
}

export enum ProcessStatus {
  PENDING = "PENDING",
  SETUP = "SETUP",
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum OutputStatus {
  GOOD = "GOOD",
  REWORK = "REWORK",
  SCRAP = "SCRAP",
  QUARANTINE = "QUARANTINE",
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
  brand?: string | null;
  model?: string | null;
  axis_count?: AxisCount | null;
  internal_cooling?: number | null;
  motor_power_kva?: number | null;
  holder_type?: string | null;
  spindle_motor_power_10_percent_kw?: number | null;
  spindle_motor_power_30_percent_kw?: number | null;
  power_hp?: number | null;
  spindle_speed_rpm?: number | null;
  tool_count?: number | null;
  nc_control_unit?: string | null;
  manufacturing_year: string | null;
  serial_number?: string | null;
  machine_weight_kg?: number | null;
  max_part_size?: string | null;
  description?: string | null;
  status: MachineStatus;
  maintenance_interval: number;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  maintenance_notes?: string | null;
}

export interface ManufacturingProcess extends BaseModel {
  process_code: string;
  process_name: string;
  standard_time_minutes: number;
  machine_type: MachineType | null;
  approved_by?: number; // User ID
}

export interface CreateBOMComponentRequest {
  bom: number;
  sequence_order: number;
  quantity: string;
  product: number;
  lead_time_days?: number | null;
  notes?: string | null;
}

export interface BomRequest {
  product: string;
  version: string;
  is_active: boolean;
}

export interface BOM extends BaseModel {
  product: Product;
  version: string;
  is_active: boolean;
  is_approved: boolean;
  approved_by: User | null;
  approved_at: string | null;
  parent_bom: number | null;
  notes: string | null;
  components?: BOMComponent[];
  modified_at?: string;
}

export interface BOMComponent extends BaseModel {
  bom: number;
  sequence_order: number;
  quantity: string;
  product?: number | null;
  product_code?: string;
  product_name?: string;
  product_type?: ProductType;
  lead_time_days: number | null;
  notes: string | null;
}

export interface BOMProcessConfig extends BaseModel {
  process: ManufacturingProcess;
  raw_material?: RawMaterial;
  process_product?: ProcessProduct;
  axis_count?: AxisCount;
  estimated_duration_minutes?: number;
  tooling_requirements?: string;
  quality_checks?: string;
}

export interface WorkflowProcess extends BaseModel {
  product: Product | number;
  product_details?: Product;
  process: ManufacturingProcess | number;
  process_details?: ManufacturingProcess;
  stock_code: string;
  sequence_order: number;
  process_configs?: ProcessConfig[];
}

export interface ProcessConfig extends BaseModel {
  workflow_process: number | WorkflowProcess;
  workflow_process_details?: WorkflowProcess;
  raw_material?: RawMaterial | number;
  raw_material_details?: RawMaterial;
  axis_count?: AxisCount;
  axis_count_display?: string;
  estimated_duration_minutes?: number;
  tooling_requirements?: string;
  quality_checks?: string;
  machine_type?: MachineType;
  machine_type_display?: string;
  setup_time_minutes?: number;
  notes?: string;
}

export interface WorkOrder extends BaseModel {
  order_number: string;
  sales_order_item: number;
  bom: BOM;
  quantity: number;
  planned_start: string;
  planned_end: string;
  actual_start?: string;
  actual_end?: string;
  status: WorkOrderStatus;
  priority: number;
  notes?: string;
  completion_percentage: number;
  assigned_to?: number; // User ID
}

export interface WorkOrderStatusChange extends BaseModel {
  work_order: number;
  from_status: WorkOrderStatus;
  to_status: WorkOrderStatus;
  changed_by?: number; // User ID
  changed_at: string;
  notes?: string;
}

export interface SubWorkOrder extends BaseModel {
  parent_work_order: number;
  bom_component: BOMComponent;
  quantity: number;
  planned_start: string;
  planned_end: string;
  actual_start?: string;
  actual_end?: string;
  status: WorkOrderStatus;
  output_quantity?: number;
  scrap_quantity: number;
  target_category?: number; // InventoryCategory ID
  notes?: string;
  completion_percentage: number;
  assigned_to?: number; // User ID
}

export interface SubWorkOrderProcess extends BaseModel {
  sub_work_order: number;
  workflow_process: number;
  machine?: number;
  sequence_order: number;
  planned_duration_minutes?: number;
  actual_duration_minutes?: number;
  status: ProcessStatus;
  start_time?: string;
  end_time?: string;
  operator?: number; // User ID
  setup_time_minutes?: number;
  notes?: string;
}

export interface WorkOrderOutput extends BaseModel {
  sub_work_order: number;
  quantity: number;
  status: OutputStatus;
  target_category: number; // InventoryCategory ID
  notes?: string;
  quarantine_reason?: string;
  inspection_required: boolean;
  created_by?: number; // User ID
  production_date: string;
}

export interface CreateBOMRequest {
  product: string; // Product code
  version?: string;
  is_active?: boolean;
}

// Helper function to calculate next maintenance date
export function calculateNextMaintenanceDate(machine: Machine): Date | null {
  if (machine.last_maintenance_date) {
    const lastDate = new Date(machine.last_maintenance_date);
    return new Date(
      lastDate.setDate(lastDate.getDate() + machine.maintenance_interval)
    );
  }
  return null;
}

// String representation helper
export function getMachineDisplayString(machine: Machine): string {
  return `${machine.machine_code} - ${machine.machine_type}`;
}

// Type guard to check if a machine needs maintenance
export function needsMaintenance(machine: Machine): boolean {
  if (!machine.next_maintenance_date) return false;
  return new Date() >= new Date(machine.next_maintenance_date);
}
