"use server";

import { login as authLogin } from "@/lib/auth";
import { cookies } from "next/headers";

export async function login(username: string, password: string) {
  try {
    const data = await authLogin(username, password);

    if (!data.success) {
      return { error: data.message };
    }

    const { user, csrfToken, sessionid } = data;
    const cookieStore = await cookies();

    if (csrfToken) {
      cookieStore.set("csrftoken", csrfToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    if (sessionid) {
      const sessionidCookie = sessionid.split("=")[1].split(";")[0];
      cookieStore.set("sessionid", sessionidCookie, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
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
