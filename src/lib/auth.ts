"use server";
import { User, AuthResponse } from "@/types/auth";
import { cookies } from "next/headers";

const API_URL = "http://localhost:8000";

export async function checkSession(): Promise<{
  isAuthenticated: boolean;
  user?: User;
}> {
  try {
    const response = await fetch(`${API_URL}/auth/session/`, {
      credentials: "include",
      cache: "no-store", // Prevent caching of auth state
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
    const response = await fetch(`${API_URL}/auth/csrf/`, {
      credentials: "include",
      cache: "no-store", // Prevent caching of CSRF token
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
    const response = await fetch(`${API_URL}/auth/login/`, {
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

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Giriş başarısız",
      };
    }

    // get sessionid from response cookies
    const sessionid = response.headers.get("Set-Cookie")?.split(";")[0];

    console.log(sessionid);

    return {
      success: true,
      user: data.user,
      csrfToken: data.csrfToken,
      sessionid: sessionid,
      message: "Giriş başarılı",
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "Giriş yapılırken bir hata oluştu",
    };
  }
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    const cookieStore = await cookies();
    const sessionid = cookieStore.get("sessionid");
    const csrfToken = cookieStore.get("csrftoken");

    const response = await fetch(`${API_URL}/auth/logout/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken?.value || "",
        sessionid: sessionid?.value || "",
        Cookie: `${sessionid?.name}=${sessionid?.value}; ${csrfToken?.name}=${csrfToken?.value}`,
      },
    });

    console.log(response);

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Çıkış başarısız",
      };
    }

    // Create response with cleared cookies
    const logoutResponse = {
      success: true,
      message: "Çıkış başarılı",
    };

    // Clear cookies by setting them to expire in the past
    cookieStore.delete("sessionid");
    cookieStore.delete("csrftoken");

    return logoutResponse;
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "Çıkış başarısız",
    };
  }
}
