"use server";
import { User, AuthResponse } from "@/types/auth";
import { cookies } from "next/headers";

const API_URL = "http://localhost:8000";

export async function checkSession(): Promise<{
  isAuthenticated: boolean;
  user?: User;
}> {
  try {
    const cookieStore = await cookies();
    const csrfToken = cookieStore.get("csrftoken");
    const sessionid = cookieStore.get("sessionid");

    // If no session cookie exists, return not authenticated
    if (!sessionid?.value) {
      return { isAuthenticated: false };
    }

    const response = await fetch(`${API_URL}/auth/session/`, {
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken?.value || "",
        Cookie: `sessionid=${sessionid.value}${
          csrfToken ? `; csrftoken=${csrfToken.value}` : ""
        }`,
      },
    });

    if (!response.ok) {
      // Clear cookies on authentication failure
      cookieStore.delete("sessionid");
      cookieStore.delete("csrftoken");
      return { isAuthenticated: false };
    }

    const data = await response.json();
    return {
      isAuthenticated: Boolean(data.isAuthenticated && data.user),
      user: data.user,
    };
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

    // Extract cookies from response headers
    const cookies = response.headers.get("set-cookie");
    const sessionCookie = cookies
      ?.split(";")
      .find((c) => c.includes("sessionid"));
    const csrfCookie = cookies?.split(";").find((c) => c.includes("csrftoken"));

    return {
      success: true,
      user: data.user,
      csrfToken: csrfCookie || data.csrfToken,
      sessionid: sessionCookie,
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
        Cookie: `sessionid=${sessionid?.value}; csrftoken=${csrfToken?.value}`,
      },
    });

    // Clear cookies regardless of response
    cookieStore.delete("sessionid");
    cookieStore.delete("csrftoken");

    if (!response.ok) {
      return {
        success: false,
        message: "Çıkış başarısız",
      };
    }

    return {
      success: true,
      message: "Çıkış başarılı",
    };
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear cookies even if there's an error
    const cookieStore = await cookies();
    cookieStore.delete("sessionid");
    cookieStore.delete("csrftoken");

    return {
      success: false,
      message: "Çıkış başarısız",
    };
  }
}
