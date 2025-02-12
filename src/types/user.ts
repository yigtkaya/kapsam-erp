export type UserRole = "ADMIN" | "ENGINEER" | "OPERATOR" | "VIEWER";

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserInput {
  username?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface ChangeRoleInput {
  role: UserRole;
}
