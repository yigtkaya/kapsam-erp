"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(username: string, password: string) {
  try {
    const response = await fetch(`http://localhost:8000/api/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    console.log(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Şifre veya kullanıcı adı hatalı");
    }

    const data = await response.json();
    const { access, refresh, user } = data;

    // Set both JWT tokens in HttpOnly cookies
    const accessExpiry = process.env.NEXT_PUBLIC_JWT_EXPIRY || "3600"; // 1 hour
    const refreshExpiry =
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY || "86400"; // 24 hours

    const cookiesList = await cookies();

    cookiesList.set({
      name: "access_token",
      value: access,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: parseInt(accessExpiry),
    });

    cookiesList.set({
      name: "refresh_token",
      value: refresh,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: parseInt(refreshExpiry),
    });

    console.log(user);

    return { user: { user } };
  } catch (error: any) {
    return { error: error.message || "Bir hata oluştu" };
  }
}

export async function logout() {
  const cookiesList = await cookies();
  cookiesList.delete("access_token");
  cookiesList.delete("refresh_token");
  redirect("/login");
}
