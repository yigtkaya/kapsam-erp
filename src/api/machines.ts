"use server";
import { Machine } from "@/types/manufacture";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchMachines(): Promise<Machine[]> {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(`${API_URL}/api/manufacturing/machines/`, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  console.log(response);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  console.log(data);
  return data;
}

export async function fetchMachine(id: string): Promise<Machine> {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(`${API_URL}/api/manufacturing/machines/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch machine");
  }

  return response.json();
}

export const createMachine = async (machine: Machine) => {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;

  console.log(machine);

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

  const data = await response.json();
  console.log("API Response:", response.status, data);

  if (!response.ok) {
    // Convert the error object to a readable message
    const errorMessage =
      typeof data === "object"
        ? Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : "Makine oluşturulurken bir hata oluştu";

    throw new Error(errorMessage);
  }

  return {
    success: true,
    message: "Machine created successfully",
    data: data,
  };
};

export const updateMachine = async (machine: Machine) => {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;

  const response = await fetch(
    `${API_URL}/api/manufacturing/machines/${machine.id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(machine),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken || "",
        Cookie: `sessionid=${sessionid}${
          csrftoken ? `; csrftoken=${csrftoken}` : ""
        }`,
      },
    }
  );

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to update machine",
    };
  }

  const data = await response.json();

  return {
    success: true,
    message: "Machine updated successfully",
    data: data,
  };
};

export const deleteMachine = async (id: number) => {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;

  const response = await fetch(`${API_URL}/api/manufacturing/machines/${id}/`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete machine");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};
