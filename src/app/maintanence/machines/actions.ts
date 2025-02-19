"use server";

import { Machine } from "@/types/manufacture";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createMachineAction(machine: Machine) {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;

  const response = await fetch(`${API_URL}/api/manufacturing/machines/`, {
    method: "POST",
    body: JSON.stringify(machine),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to create machine",
    };
  }

  const data = await response.json();

  return {
    success: true,
    message: "Machine created successfully",
    data: data,
  };
}
