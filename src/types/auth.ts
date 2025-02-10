export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  departments?: string[];
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  csrfToken?: string;
  message?: string;
  sessionid?: string;
}
