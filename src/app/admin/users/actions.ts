"use server";
import { User, UserRole } from "@/types/user";
import { cookies } from "next/headers";

const API_URL = "http://localhost:8000";

export async function getUsers(): Promise<User[]> {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(`${API_URL}/api/users/`, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();
  console.log(data);
  return data;
}

export async function getUser(id: string): Promise<User> {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(`${API_URL}/api/users/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();

  return data;
}

export async function updateUser(userId: string, user: User) {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  console.log(user);

  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}; csrftoken=${csrftoken}`,
    },
    body: JSON.stringify(user),
  });

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  const data = await response.json();

  console.log(data);

  return data;
}

export async function updateUserRole(userId: string, role: UserRole) {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(`${API_URL}/api/users/${userId}/role`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    throw new Error("Failed to update user role");
  }

  const data = await response.json();

  console.log(data);

  return data;
}

export async function deleteUser(userId: string) {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
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
    throw new Error("Failed to delete user");
  }

  const data = await response.json();

  console.log(data);

  return data;
}

export async function createUser(user: any) {
  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  console.log(user);

  const response = await fetch(`${API_URL}/api/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}; csrftoken=${csrftoken}`,
    },
    body: JSON.stringify(user),
  });

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const data = await response.json();

  console.log(data);

  return data;
}
