import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/api/customers";
import { Customer } from "@/types/customer";

export function useCustomers() {
  return useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: () => getCustomers() as Promise<Customer[]>,
  });
}
