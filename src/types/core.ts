// File: erp_types.ts

/*** TextChoices as Union Types ***/

// ProductType choices
export type ProductType = "MONTAGED" | "SEMI" | "SINGLE" | "STANDARD_PART";

// ComponentType choices
export type ComponentType =
  | "SEMI_PRODUCT"
  | "MONTAGED_PRODUCT"
  | "RAW_MATERIAL"
  | "STANDARD_PART";

// MachineStatus choices
export type MachineStatus = "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "RETIRED";

// WorkOrderStatus choices
export type WorkOrderStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DELAYED";

// UserRole choices
export type UserRole = "ADMIN" | "ENGINEER" | "OPERATOR" | "VIEWER";

/*** Permission ***/
export interface Permission {
  id: number;
  name: string;
  codename: string;
  // You can add additional fields such as content type info if necessary.
}

/*** BaseModel ***/
// This interface represents fields shared across multiple models.
export interface BaseModel {
  id: number;
  created_at: string; // ISO formatted date/time string
  modified_at: string; // ISO formatted date/time string
  created_by?: User;
  modified_by?: User;
}

/*** User Model ***/
// Mapping Django's AbstractUser extension.
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  last_login?: string; // ISO formatted date/time string (optional)
  is_active: boolean;
  created_at: string; // ISO formatted date/time string
  departments: Department[];
  user_permissions?: Permission[];
  // Additional fields can be added as required.
}

/*** Department Model ***/
export interface Department {
  id: number;
  name: string;
  description?: string;
  created_at: string; // ISO formatted date/time string
}

/*** Customer Model ***/
// Inherits the BaseModel attributes.
export interface Customer extends BaseModel {
  code: string;
  name: string;
}

/*** UserProfile Model ***/
export interface UserProfile {
  id: number;
  user: User;
  department?: Department;
  phone_number?: string;
  employee_id: string;
  is_department_head: boolean;
}

/*** RolePermission Model ***/
export interface RolePermission {
  id: number;
  role: UserRole;
  permission: Permission;
}
