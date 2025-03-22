"use server";

import { login as authLogin } from "@/api/auth";
import { cookies } from "next/headers";

export async function login(username: string, password: string) {
  try {
    const data = await authLogin(username, password);

    if (!data.success) {
      return { error: data.message };
    }

    const { user, csrfToken, sessionid } = data;
    const cookieStore = await cookies();

    console.log("Login action - received data:", {
      userExists: !!user,
      hasCsrfToken: !!csrfToken,
      hasSessionId: !!sessionid,
    });

    // Double check that we're setting cookies in the action
    if (csrfToken) {
      cookieStore.set("csrftoken", csrfToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      console.log("Login action - Set csrftoken cookie");
    }

    if (sessionid) {
      // The sessionid might come in different formats from the API
      let sessionValue = sessionid;

      // If it's a full cookie string (sessionid=value; path=...), extract just the value
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
      });
      console.log("Login action - Set sessionid cookie:", sessionValue);
    }

    // Add a small delay to ensure cookies are set
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Return a plain object with success flag
    return { success: true, user };
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    return {
      error: "Giriş yapılırken bir hata oluştu",
    };
  }
}
