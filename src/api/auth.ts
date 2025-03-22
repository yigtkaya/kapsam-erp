"use server";
import { User, AuthResponse } from "@/types/auth";
import { cookies } from "next/headers";
import { fetchApi, postApi } from "./api-helpers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function checkSession(): Promise<{
  isAuthenticated: boolean;
  user?: User;
}> {
  try {
    const cookieStore = await cookies();
    const sessionid = cookieStore.get("sessionid");
    const csrftoken = cookieStore.get("csrftoken");

    console.log("checkSession - Cookies:", {
      hasSessionid: !!sessionid?.value,
      hasCsrftoken: !!csrftoken?.value,
      sessionidValue: sessionid?.value?.slice(0, 5) + "...",
    });

    // If no session cookie exists, return not authenticated
    if (!sessionid?.value) {
      console.log("checkSession - No sessionid cookie found");
      return { isAuthenticated: false };
    }

    try {
      // Make a direct fetch request to see the raw response
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const response = await fetch(`${apiUrl}/auth/session/`, {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: `sessionid=${sessionid.value}${
            csrftoken ? `; csrftoken=${csrftoken.value}` : ""
          }`,
        },
      });

      console.log("checkSession - Raw response status:", response.status);

      if (!response.ok) {
        console.error(
          "checkSession - Error response:",
          response.status,
          response.statusText
        );
        return { isAuthenticated: false };
      }

      const data = await response.json();
      console.log("checkSession - Response data:", data);

      return {
        isAuthenticated: Boolean(data.isAuthenticated && data.user),
        user: data.user,
      };
    } catch (fetchError) {
      console.error("checkSession - Fetch error:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error("Session check failed:", error);
    const cookieStore = await cookies();
    cookieStore.delete("sessionid");
    cookieStore.delete("csrftoken");
    return { isAuthenticated: false };
  }
}

export async function getCsrfToken(): Promise<string | undefined> {
  try {
    const data = await fetchApi<{ csrfToken: string }>("/auth/csrf/");
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
    // Directly use fetch instead of postApi to get access to the raw response headers
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
        message: errorData.message || `Error: ${response.status}`,
      };
    }

    const data = await response.json();

    // Get the cookies from the response
    console.log(
      "Response headers:",
      Object.fromEntries([...response.headers.entries()])
    );

    // Extract sessionid and csrftoken from headers
    const cookieStore = await cookies();

    // Extract cookies from response
    let sessionid: string | undefined;
    let csrftoken: string | undefined;

    // Get the Set-Cookie header
    const setCookieHeader = response.headers.get("set-cookie");
    console.log("Set-Cookie header:", setCookieHeader);

    // Process the Set-Cookie header if it exists
    if (setCookieHeader) {
      // Split multiple cookies if they exist
      const cookieParts = setCookieHeader.split(",");

      for (const cookiePart of cookieParts) {
        if (cookiePart.includes("sessionid=")) {
          const sessionidMatch = cookiePart.match(/sessionid=([^;]+)/);
          if (sessionidMatch && sessionidMatch[1]) {
            sessionid = sessionidMatch[1];
            console.log("Extracted sessionid from header:", sessionid);
          }
        }

        if (cookiePart.includes("csrftoken=")) {
          const csrftokenMatch = cookiePart.match(/csrftoken=([^;]+)/);
          if (csrftokenMatch && csrftokenMatch[1]) {
            csrftoken = csrftokenMatch[1];
            console.log("Extracted csrftoken from header:", csrftoken);
          }
        }
      }
    }

    // If we couldn't extract from headers, try from the response data
    if (!sessionid && data.sessionid) {
      // Try to extract sessionid from the response data
      const sessionidMatch = data.sessionid.match(/sessionid=([^;]+)/);
      if (sessionidMatch && sessionidMatch[1]) {
        sessionid = sessionidMatch[1];
        console.log("Extracted sessionid from response data:", sessionid);
      }
    }

    if (!csrftoken && data.csrfToken) {
      csrftoken = data.csrfToken;
      console.log("Using csrfToken from response data:", csrftoken);
    }

    // Set the cookies
    if (csrftoken) {
      cookieStore.set("csrftoken", csrftoken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    if (sessionid) {
      cookieStore.set("sessionid", sessionid, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    // Add a small delay to ensure cookies are set
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      success: true,
      user: data.user,
      csrfToken: csrftoken,
      sessionid: sessionid,
      message: data.message || "Giriş başarılı",
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
    await postApi("/auth/logout/", {});

    // Clear cookies
    const cookieStore = await cookies();
    cookieStore.delete("sessionid");
    cookieStore.delete("csrftoken");

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
