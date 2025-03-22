"use server";

import { fetchApi } from "./api-helpers";

// Changed from const arrow function to regular async function
export async function getCustomers() {
  return fetchApi("/api/customers/");
}
