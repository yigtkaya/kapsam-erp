import { BOMProcessConfig } from "@/types/manufacture";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to get cookies and headers
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;
  // Extract the token value from the raw cookie string.
  // This regex looks for `csrftoken=` followed by a group of non-semicolon characters.
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;

  return {
    "Content-Type": "application/json",
    "X-CSRFToken": csrftoken || "",
    Cookie: `sessionid=${sessionid}${
      csrftoken ? `; csrftoken=${csrftoken}` : ""
    }`,
  };
}

export async function fetchProcessConfigs(): Promise<BOMProcessConfig[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/process-configs/`,
    {
      headers,
    }
  );

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to fetch process configs");
  }

  return response.json();
}

export async function fetchProcessConfig(
  id: number
): Promise<BOMProcessConfig> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/manufacturing/p rocess-configs/${id}/`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch process config");
  }

  return response.json();
}
