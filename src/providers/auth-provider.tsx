"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getCsrfToken, refreshToken } from "@/lib/auth";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  departments: string[];
}

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
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage if available
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        const refreshTokenValue = Cookies.get("refresh_token");
        const savedUser = localStorage.getItem("user");

        if (!accessToken && refreshTokenValue) {
          // Try to refresh the token
          try {
            const refreshData = await refreshToken();
            if (refreshData.access) {
              Cookies.set("access_token", refreshData.access, {
                expires: 1, // 1 day
                path: "/",
                sameSite: "strict",
                secure: window.location.protocol === "https:",
              });
            }
          } catch (refreshError) {
            // If refresh fails, clear everything
            localStorage.removeItem("user");
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            Cookies.remove("csrftoken");
            setUser(null);
            redirectToLogin();
            return;
          }
        }

        if (!accessToken || !refreshTokenValue) {
          // Clear everything if tokens are missing
          localStorage.removeItem("user");
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          Cookies.remove("csrftoken");
          setUser(null);
          redirectToLogin();
          return;
        }

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);

          // Redirect if authenticated user tries to access public pages
          if (PUBLIC_ROUTES.includes(window.location.pathname)) {
            window.location.href = "/dashboard";
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear everything on error
        localStorage.removeItem("user");
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("csrftoken");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    const redirectToLogin = () => {
      // Only redirect if not already on a public route
      if (!PUBLIC_ROUTES.includes(window.location.pathname)) {
        const currentPath = window.location.pathname;
        window.location.href = `/login?callbackUrl=${encodeURIComponent(
          currentPath
        )}`;
      }
    };

    checkAuth();

    // Check auth status more frequently
    const interval = setInterval(checkAuth, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("csrftoken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const getCsrf = async () => {
    try {
      const csrfToken = await getCsrfToken();
      if (csrfToken) {
        Cookies.set("csrftoken", csrfToken, {
          expires: 1, // 1 day
          path: "/",
          sameSite: "strict",
          secure: window.location.protocol === "https:",
        });
      }
      return csrfToken;
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
