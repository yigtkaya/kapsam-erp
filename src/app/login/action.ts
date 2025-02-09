"use server";

import { redirect } from "next/navigation";
import { login as authLogin } from "@/lib/auth";
import { cookies } from "next/headers";

export async function login(username: string, password: string) {
  try {
    const data = await authLogin(username, password);

    if (!data.success) {
      return { error: data.message };
    }

    const { access, refresh, user, csrfToken } = data;

    // Set cookies server-side
    const cookieStore = await cookies();

    // Set access token
    cookieStore.set({
      name: "access_token",
      value: access,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Set refresh token
    cookieStore.set({
      name: "refresh_token",
      value: refresh,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

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

    return { user };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Bir hata oluştu" };
  }
}

export async function logout() {
  const cookieStore = await cookies();

  // Clear all auth cookies
  cookieStore.set({
    name: "access_token",
    value: "",
    maxAge: 0,
  });

  cookieStore.set({
    name: "refresh_token",
    value: "",
    maxAge: 0,
  });

  cookieStore.set({
    name: "csrftoken",
    value: "",
    maxAge: 0,
  });

  redirect("/login");
}
