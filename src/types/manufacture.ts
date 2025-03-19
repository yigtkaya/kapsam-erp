import { User } from "./auth";
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
  NONE = "YOK",
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

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum ProcessConfigStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

// Base interface for common fields
export interface BaseModel {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBOMComponentRequest {
  bom?: number;
  sequence_order: number;
  quantity: string;
  product: number;
  notes?: string | null;
}

export interface BomRequest {
  product: number;
  version: string;
  is_active: boolean;
  notes?: string | null;
  components: CreateBOMComponentRequest[] | null;
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
  notes: string | null;
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
}

export interface ProductWorkflow extends BaseModel {
  product: number;
  product_code: string;
  product_name: string;
  version: string;
  status: WorkflowStatus;
  effective_date: string | null;
  notes: string | null;
  process_configs: ProcessConfig[];
  created_by: number;
  created_by_name: string;
  approved_by: number | null;
  approved_at: string | null;
}

export interface ProcessConfig extends BaseModel {
  workflow: number;
  process: number;
  process_code: string;
  process_name: string;
  version: string;
  status: ProcessConfigStatus;
  sequence_order: number;
  stock_code: string;
  tool?: string | null;
  control_gauge?: string | null;
  fixture?: string | null;
  fixture_name?: string | null;
  axis_count?: AxisCount | null;
  machine_time?: number | null;
  setup_time?: number | null;
  net_time?: number | null;
  number_of_bindings: number;
  effective_date?: string | null;
  description?: string | null;
  cycle_time?: number;
  modified_at: string;
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
  completion_percentage: number;
  assigned_to?: number;
}

export interface WorkOrderStatusChange extends BaseModel {
  work_order: number;
  from_status: WorkOrderStatus;
  to_status: WorkOrderStatus;
  changed_by?: number;
  changed_at: string;
  notes?: string;
}

export interface SubWorkOrder extends BaseModel {
  parent_work_order: number;
  bom_component: number;
  quantity: number;
  planned_start: string;
  planned_end: string;
  actual_start?: string;
  actual_end?: string;
  status: WorkOrderStatus;
  output_quantity?: number;
  scrap_quantity: number;
  target_category?: number;
  notes?: string;
  completion_percentage: number;
  assigned_to?: number;
}

export interface SubWorkOrderProcess extends BaseModel {
  sub_work_order: number;
  process_config?: number;
  machine?: number;
  sequence_order: number;
  planned_duration_minutes?: number;
  actual_duration_minutes?: number;
  status: ProcessStatus;
  start_time?: string;
  end_time?: string;
  operator?: number;
  setup_time_minutes?: number;
  notes?: string;
}

export interface WorkOrderOutput extends BaseModel {
  sub_work_order: number;
  quantity: number;
  status: OutputStatus;
  target_category: number;
  notes?: string;
  quarantine_reason?: string;
  inspection_required: boolean;
  created_by?: number;
  production_date: string;
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
