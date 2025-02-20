"use server";
import { Product, TechnicalDrawing } from "@/types/inventory";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ProductsParams {
  category?: string;
  product_type?: string;
  product_name?: string;
  product_code?: string;
}

interface ProductParams {
  id: string;
}

export async function fetchProducts({
  category,
  product_type,
  product_name,
  product_code,
}: ProductsParams): Promise<Product[]> {
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (product_type) params.append("product_type", product_type);
  if (product_name) params.append("product_name", product_name);
  if (product_code) params.append("product_code", product_code);

  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  console.log("params", params.toString());

  const response = await fetch(
    `${API_URL}/api/inventory/products/?${params.toString()}`,
    {
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
    return [] as Product[];
  }

  const data = await response.json();

  return data as Product[];
}

export async function fetchProduct({ id }: ProductParams): Promise<Product> {
  const params = new URLSearchParams();

  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;
  const response = await fetch(`${API_URL}/api/inventory/products/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      Cookie: `sessionid=${sessionid}${
        csrftoken ? `; csrftoken=${csrftoken}` : ""
      }`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await response.json();

  return data;
}

export const createProduct = async (product: Product) => {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;
  // Extract the token value from the raw cookie string.
  // This regex looks for `csrftoken=` followed by a group of non-semicolon characters.
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;

  const productJson = {
    product_code: product.product_code,
    product_name: product.product_name,
    product_type: product.product_type,
    description: product.description,
    current_stock: product.current_stock,
    inventory_category: product.inventory_category,
  };

  console.log(productJson);

  const response = await fetch(`${API_URL}/api/inventory/products/`, {
    method: "POST",
    body: JSON.stringify(productJson),
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
    console.log(response);
    return {
      success: false,
      message: "Failed to create product",
    };
  }

  const data = await response.json();

  return {
    success: true,
    message: "Product created successfully",
    data: data,
  };
};

export const updateProduct = async (product: Product) => {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;

  // Extract the token value from the raw cookie string.
  // This regex looks for `csrftoken=` followed by a group of non-semicolon characters.
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;
  console.log("extracted token", csrftoken);

  const productJson = {
    product_code: product.product_code,
    product_name: product.product_name,
    product_type: product.product_type,
    description: product.description,
    current_stock: product.current_stock,
    inventory_category: product.inventory_category,
  };

  const response = await fetch(
    `${API_URL}/api/inventory/products/${product.id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(productJson),
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
    console.log(response);
    return {
      success: false,
      message: "Failed to update product",
    };
  }

  const data = await response.json();

  return {
    success: true,
    message: "Product updated successfully",
    data: data,
  };
};

export const createTechnicalDrawing = async (
  technicalDrawing: TechnicalDrawing,
  product_id: number
) => {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;

  // Extract the token value from the raw cookie string.
  // This regex looks for `csrftoken=` followed by a group of non-semicolon characters.
  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;
  console.log("extracted token", csrftoken);

  const formData = new FormData();
  formData.append("drawing_code", technicalDrawing.drawing_code);
  formData.append("version", technicalDrawing.version);
  formData.append("effective_date", technicalDrawing.effective_date);
  if (technicalDrawing.drawing_file) {
    formData.append("drawing_file", technicalDrawing.drawing_file);
  }

  const response = await fetch(
    `${API_URL}/api/inventory/products/${product_id}/upload-technical-drawing/`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        // Remove Content-Type header - let browser set it automatically
        "X-CSRFToken": csrftoken || "",
        Cookie: `sessionid=${sessionid}${
          csrftoken ? `; csrftoken=${csrftoken}` : ""
        }`,
      },
    }
  );

  if (!response.ok) {
    // Add error handling to get more details about the error
    const errorText = await response.text();
    console.error("Error response:", errorText);
    return {
      success: false,
      message: `Failed to create technical drawing: ${errorText}`,
    };
  }

  const data = await response.json();
  return data;
};

export const deleteProduct = async (id: number) => {
  const cookieStore = await cookies();
  const rawCSRFCookie = cookieStore.get("csrftoken")?.value || "";
  const sessionid = cookieStore.get("sessionid")?.value;

  const tokenMatch = rawCSRFCookie.match(/csrftoken=([^;]+)/);
  const csrftoken = tokenMatch ? tokenMatch[1] : rawCSRFCookie;

  const response = await fetch(`${API_URL}/api/inventory/products/${id}/`, {
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
  return data;
};
