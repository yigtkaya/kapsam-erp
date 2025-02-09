"use server";
import { User, AuthResponse } from "@/types/auth";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function checkSession(): Promise<{
  isAuthenticated: boolean;
  user?: User;
}> {
  try {
    const response = await fetch(`${API_URL}/api/auth/session/`, {
      credentials: "include",
    });

    if (!response.ok) {
      return { isAuthenticated: false };
    }

    return await response.json();
  } catch (error) {
    console.error("Session check failed:", error);
    return { isAuthenticated: false };
  }
}

export async function getCsrfToken(): Promise<string | undefined> {
  try {
    const response = await fetch(`${API_URL}/api/auth/csrf/`, {
      credentials: "include",
    });
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
    return undefined;
  }
}

export async function login(
  username: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/login/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      throw new Error(data.message || "Giriş başarısız");
    }

    return {
      success: true,
      user: data.user,
      access: data.access,
      refresh: data.refresh,
      csrfToken: data.csrfToken,
      message: "Giriş başarılı",
    };
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout/`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Çıkış başarısız");
    }
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function refreshToken() {
  try {
    const cookieStore = await cookies();
    const csrfToken = cookieStore.get("csrftoken");
    const refreshToken = cookieStore.get("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_URL}/api/auth/refresh/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken?.value || "",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Token refresh failed");
    }

    return data;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
}
