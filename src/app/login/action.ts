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

    // Set cookies server-side
    const cookieStore = await cookies();

    console.log(csrfToken, sessionid);

    // Set CSRF token if available
    if (csrfToken) {
      cookieStore.set({
        name: "csrftoken",
        value: csrfToken,
        httpOnly: false, // Need to be accessible from JavaScript
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
    }

    if (sessionid) {
      const sessionidCookie = sessionid.split("=")[1];
      cookieStore.set({
        name: "sessionid",
        value: sessionidCookie,
        httpOnly: false, // Need to be accessible from JavaScript
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
    }

    return { user };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Bir hata oluştu" };
  }
}
