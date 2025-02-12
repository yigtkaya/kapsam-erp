export type UserRole = "ADMIN" | "ENGINEER" | "OPERATOR" | "VIEWER";

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile: UserProfile;
}

export interface UserProfile {
  employee_id: string;
  phone_number: string;
}

export interface ChangeRoleInput {
  role: UserRole;
}
