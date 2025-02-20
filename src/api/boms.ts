"use server";

import { BOM } from "@/types/manufacture";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchBOM(id: number): Promise<BOM> {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(`${API_URL}/api/manufacturing/boms/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch BOM");
  }

  const data = await response.json();
  return data;
}

export async function fetchBOMs(): Promise<BOM[]> {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(`${API_URL}/api/manufacturing/boms/`, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  console.log("BOMs response:", response);

  const data = await response.json();
  console.log("BOMs fetched successfully:", data);
  return data;
}

export async function createBOM(data: Omit<BOM, "id">) {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  try {
    const response = await fetch(`${API_URL}/api/manufacturing/boms/`, {
      method: "POST",
      credentials: "include", // Added to include cookies automatically
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken || "",
        Cookie: `sessionid=${sessionid}${
          csrftoken ? `; csrftoken=${csrftoken}` : ""
        }`,
      },
      body: JSON.stringify(data),
    });

    console.log("BOM creation response:", response);

    if (!response.ok) {
      throw new Error("Failed to create BOM");
    }

    revalidatePath("/boms");
    return await response.json();
  } catch (error) {
    console.error("Error creating BOM:", error);
    throw error;
  }
}

export async function updateBOM(id: string, data: Partial<BOM>) {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  try {
    const response = await fetch(`${API_URL}/api/manufacturing/boms/${id}/`, {
      method: "PATCH",
      credentials: "include", // Added to include cookies automatically

      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken || "",
        Cookie: `sessionid=${sessionid}${
          csrftoken ? `; csrftoken=${csrftoken}` : ""
        }`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update BOM");
    }

    revalidatePath("/boms");
    return await response.json();
  } catch (error) {
    console.error("Error updating BOM:", error);
    throw error;
  }
}

export async function deleteBOM(id: string) {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  try {
    const response = await fetch(`${API_URL}/api/manufacturing/boms/${id}/`, {
      method: "DELETE",
      credentials: "include", // Added to include cookies automatically

      headers: {
        "X-CSRFToken": csrftoken || "",
        Cookie: `sessionid=${sessionid}${
          csrftoken ? `; csrftoken=${csrftoken}` : ""
        }`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete BOM");
    }

    revalidatePath("/boms");
    return true;
  } catch (error) {
    console.error("Error deleting BOM:", error);
    throw error;
  }
}
