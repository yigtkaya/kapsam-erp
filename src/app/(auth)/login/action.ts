"use server";

import { login as authLogin } from "@/api/auth";
import { cookies } from "next/headers";

/**
 * Server Action for handling user login
 * Uses the auth API to authenticate and sets cookies
 */
export async function login(username: string, password: string) {
  try {
    // Call the API function to authenticate
    const data = await authLogin(username, password);

    if (!data.success) {
      return {
        error: data.message || "Kimlik doğrulama başarısız",
        success: false,
      };
    }

    const { user, csrfToken, sessionid } = data;
    const cookieStore = await cookies();

    // Set cookies if they weren't already set by the API call
    if (csrfToken) {
      // Double check that the csrftoken is not already set
      if (!cookieStore.get("csrftoken")) {
        cookieStore.set("csrftoken", csrfToken, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 14, // 14 days
        });
      }
    }

    if (sessionid) {
      // Double check that the sessionid is not already set
      if (!cookieStore.get("sessionid")) {
        // Clean the sessionid if it comes with extra cookie attributes
        let sessionValue = sessionid;
        if (sessionid.includes("=")) {
          const sessionidMatch = sessionid.match(/sessionid=([^;]+)/);
          if (sessionidMatch && sessionidMatch[1]) {
            sessionValue = sessionidMatch[1];
          }
        }

        cookieStore.set("sessionid", sessionValue, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
    }

    // Return the user object and success status
    return {
      success: true,
      user,
      message: data.message || "Giriş başarılı",
    };
  } catch (error) {
    // Handle any errors
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Giriş yapılırken bir hata oluştu";

    return {
      error: errorMessage,
      success: false,
    };
  }
}
