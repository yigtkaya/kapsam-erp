"use server";

import { Product, RawMaterial } from "@/types/inventory";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createRawMaterial(rawMaterial: RawMaterial){
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;

  // Extract the token value from the raw cookie string.
  // This regex looks for `csrftoken=` followed by a group of non-semicolon characters.
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;
  console.log("extracted token", csrftoken);

  const response = await fetch(`${API_URL}/api/inventory/raw-materials/`, {
    method: "POST",
    body: JSON.stringify({
      material_code: rawMaterial.material_code,
      material_name: rawMaterial.material_name,
      current_stock: rawMaterial.current_stock,
      unit: rawMaterial.unit.id,
      inventory_category: 1,
      material_type: rawMaterial.material_type,
      width: rawMaterial.width,
      height: rawMaterial.height,
      thickness: rawMaterial.thickness,
      diameter_mm: rawMaterial.diameter_mm,
    }),
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
    return {
      success: false,
      message: "Failed to create raw material",
    };
  }

  const data = await response.json();
  console.log(data);
  return data;
};

export async function updateRawMaterial(rawMaterial: RawMaterial){
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;

  // Extract the token value from the raw cookie string.
  // This regex looks for `csrftoken=` followed by a group of non-semicolon characters.
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;
  console.log("extracted token", csrftoken);

  const response = await fetch(
    `${API_URL}/api/inventory/raw-materials/${rawMaterial.id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(rawMaterial),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken || "",
        Cookie: `sessionid=${sessionid}${
          csrftoken ? `; csrftoken=${csrftoken}` : ""
        }`,
      },
    }
  );

  console.log(response);

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to update raw material",
    };
  }
  const data = await response.json();
  console.log(data);
  return data;
};

export async function deleteRawMaterial(id: number){
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;

  // Extract the token value from the raw cookie string.
  // This regex looks for `csrftoken=` followed by a group of non-semicolon characters.
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;
  console.log("extracted token", csrftoken);

  const response = await fetch(
    `${API_URL}/api/inventory/raw-materials/${id}/`,
    {
      method: "DELETE",
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
    // Optionally handle the error here
    throw new Error("Network response was not ok");
  }

  // If the status is 204 No Content, do not attempt to parse JSON
  if (response.status === 204) {
    console.log("Raw material deleted successfully with no content returned");
    return null;
  }

  // Otherwise, attempt to parse the JSON response
  const data = await response.json();
  console.log(data);
  return data;
};
