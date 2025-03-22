"use server";

/**
 * Helper functions for API calls
 */

// Instead of exporting API_URL directly, we'll use it privately
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get the API URL - use this instead of accessing process.env directly
 */
export async function getApiUrl(): Promise<string> {
  return API_URL || "";
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
  };
};

/**
 * Create standard fetch options for API calls
 * Middleware will handle authentication headers automatically
 */
export async function createFetchOptions(
  options: RequestOptions = {}
): Promise<RequestInit> {
  const { method = "GET", body, headers = {}, cache, next } = options;

  return {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next,
  };
}

/**
 * Fetch data from API with error handling
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const apiUrl = await getApiUrl();
  const fetchOptions = await createFetchOptions(options);
  const response = await fetch(`${apiUrl}${endpoint}`, fetchOptions);

  if (!response.ok) {
    // Try to get error message from response
    let errorMessage: string;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.detail || `Error: ${response.status}`;
    } catch (e) {
      errorMessage = `Error: ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}

/**
 * Send data to API with error handling
 */
export async function postApi<T>(
  endpoint: string,
  data: any,
  options: RequestOptions = {}
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "POST",
    body: data,
    ...options,
  });
}

/**
 * Update data on API with error handling
 */
export async function updateApi<T>(
  endpoint: string,
  data: any,
  options: RequestOptions = {}
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "PATCH",
    body: data,
    ...options,
  });
}

/**
 * Delete data on API with error handling
 */
export async function deleteApi(
  endpoint: string,
  options: RequestOptions = {}
): Promise<void> {
  return fetchApi<void>(endpoint, {
    method: "DELETE",
    ...options,
  });
}
