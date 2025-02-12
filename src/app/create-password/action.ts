"use server";
import { cookies } from "next/headers";

const API_URL = "http://localhost:8000";

// API http://your-domain/set-password/<uid>/<token>/
// req body: { password: password }

export async function createPassword(
  uid: string,
  token: string,
  password: string
) {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(`${API_URL}/set-password/${uid}/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
    body: JSON.stringify({ password: password }),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  const data = await response.json();

  return data;
}
