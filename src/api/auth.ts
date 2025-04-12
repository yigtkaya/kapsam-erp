"use server";
import { User, AuthResponse } from "@/types/auth";
import { cookies } from "next/headers";
import { fetchApi, postApi } from "./api-helpers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Check if the user has an active session
 */
export async function checkSession(): Promise<{
  isAuthenticated: boolean;
  user?: User;
}> {
  try {
    const cookieStore = await cookies();
    const sessionid = cookieStore.get("sessionid");
    const csrftoken = cookieStore.get("csrftoken");

    // If no session cookie exists, return not authenticated
    if (!sessionid?.value) {
      return { isAuthenticated: false };
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const response = await fetch(`${apiUrl}/auth/session/`, {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: `sessionid=${sessionid.value}${
            csrftoken ? `; csrftoken=${csrftoken.value}` : ""
          }`,
        },
        // Add cache control to prevent stale session data
        cache: "no-store",
      });

      if (!response.ok) {
        // Clear cookies if session is invalid
        if (response.status === 401) {
          cookieStore.delete("sessionid");
          cookieStore.delete("csrftoken");
        }
        return { isAuthenticated: false };
      }

      const data = await response.json();
      return {
        isAuthenticated: Boolean(data.isAuthenticated && data.user),
        user: data.user,
      };
    } catch (fetchError) {
      throw fetchError;
    }
  } catch (error) {
    // Clear cookies on error as a safety measure
    const cookieStore = await cookies();
    cookieStore.delete("sessionid");
    cookieStore.delete("csrftoken");
    return { isAuthenticated: false };
  }
}

/**
 * Get CSRF token for securing form submissions
 */
export async function getCsrfToken(): Promise<string | undefined> {
  try {
    const data = await fetchApi<{ csrfToken: string }>("/auth/csrf/");
    return data.csrfToken;
  } catch (error) {
    return undefined;
  }
}

/**
 * Login user and set session cookies
 */
export async function login(
  username: string,
  password: string
): Promise<AuthResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    const response = await fetch(`${apiUrl}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message:
          errorData.message || errorData.detail || `Error ${response.status}`,
      };
    }

    const data = await response.json();
    const cookieStore = await cookies();

    // Extract cookies from response
    let sessionid: string | undefined;
    let csrftoken: string | undefined;

    // Get the Set-Cookie header
    const setCookieHeader = response.headers.get("set-cookie");

    // Process the Set-Cookie header if it exists
    if (setCookieHeader) {
      const cookieParts = setCookieHeader.split(",");

      for (const cookiePart of cookieParts) {
        if (cookiePart.includes("sessionid=")) {
          const sessionidMatch = cookiePart.match(/sessionid=([^;]+)/);
          if (sessionidMatch && sessionidMatch[1]) {
            sessionid = sessionidMatch[1];
          }
        }

        if (cookiePart.includes("csrftoken=")) {
          const csrftokenMatch = cookiePart.match(/csrftoken=([^;]+)/);
          if (csrftokenMatch && csrftokenMatch[1]) {
            csrftoken = csrftokenMatch[1];
          }
        }
      }
    }

    // If we couldn't extract from headers, try from the response data
    if (!sessionid && data.sessionid) {
      const sessionidMatch = data.sessionid.match(/sessionid=([^;]+)/);
      if (sessionidMatch && sessionidMatch[1]) {
        sessionid = sessionidMatch[1];
      }
    }

    if (!csrftoken && data.csrfToken) {
      csrftoken = data.csrfToken;
    }

    // Set the cookies with improved security settings
    if (csrftoken) {
      cookieStore.set("csrftoken", csrftoken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 14, // 14 days
      });
    }

    if (sessionid) {
      cookieStore.set("sessionid", sessionid, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return {
      success: true,
      user: data.user,
      csrfToken: csrftoken,
      sessionid: sessionid,
      message: data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Authentication failed",
    };
  }
}

/**
 * Logout user and clear session cookies
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await postApi<{ message?: string }>("/auth/logout/", {});

    // Clear cookies
    const cookieStore = await cookies();
    cookieStore.delete("sessionid");
    cookieStore.delete("csrftoken");

    return {
      success: true,
      message: response?.message || "Logout successful",
    };
  } catch (error: any) {
    // Still clear cookies even if there's an error
    const cookieStore = await cookies();
    cookieStore.delete("sessionid");
    cookieStore.delete("csrftoken");

    return {
      success: false,
      message: error.message || "Logout failed",
    };
  }
}
