import { fetchProcesses } from "@/api/manufacturing-processes";
import { ManufacturingProcess } from "@/types/manufacture";
import { useQuery } from "@tanstack/react-query";

// Manufacturing Process hooks
export function useProcesses() {
  return useQuery<ManufacturingProcess[]>({
    queryKey: ["processes"],
    queryFn: () => fetchProcesses(),
  });
}
