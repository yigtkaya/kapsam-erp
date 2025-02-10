"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkSession, getCsrfToken } from "@/lib/auth";
import { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => void;
  getCsrf: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  logout: () => {},
  getCsrf: async () => undefined,
});

export const useAuth = () => useContext(AuthContext);

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/forgot-password", "/register"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAuthenticated, user } = await checkSession();

        if (!isAuthenticated) {
          setUser(null);
          if (!PUBLIC_ROUTES.includes(window.location.pathname)) {
            redirectToLogin();
          }
          return;
        }

        if (user) {
          setUser(user);
          // Redirect if authenticated user tries to access public pages
          if (PUBLIC_ROUTES.includes(window.location.pathname)) {
            window.location.href = "/dashboard";
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        if (!PUBLIC_ROUTES.includes(window.location.pathname)) {
          redirectToLogin();
        }
      } finally {
        setIsLoading(false);
      }
    };

    const redirectToLogin = () => {
      const currentPath = window.location.pathname;
      window.location.href = `/login?callbackUrl=${encodeURIComponent(
        currentPath
      )}`;
    };

    checkAuth();

    // Check auth status periodically
    const interval = setInterval(checkAuth, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    setUser(null);
    window.location.href = "/login";
  };

  const getCsrf = async () => {
    try {
      return await getCsrfToken();
    } catch (error) {
      console.error("Failed to get CSRF token:", error);
      return undefined;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout, getCsrf }}>
      {children}
    </AuthContext.Provider>
  );
}
