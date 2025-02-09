export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  departments?: string[];
}

export interface AuthResponse {
  success: boolean;
  user: User;
  access: string;
  refresh: string;
  csrfToken?: string;
  message?: string;
}
