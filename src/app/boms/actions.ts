"use server";

import { revalidatePath } from "next/cache";
import { BOM } from "@/types/manufacture";

export async function createBOM(data: Omit<BOM, "id">) {
  try {
    const response = await fetch(`${process.env.API_URL}/api/boms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

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
  try {
    const response = await fetch(`${process.env.API_URL}/api/boms/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`${process.env.API_URL}/api/boms/${id}`, {
      method: "DELETE",
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
