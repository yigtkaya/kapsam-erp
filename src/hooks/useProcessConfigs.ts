import { useQuery } from "@tanstack/react-query";
import { ProcessConfig } from "@/types/manufacture";
import { fetchProcessConfig, fetchProcessConfigs } from "@/api/process-comp";

export function useProcessConfigs() {
  return useQuery<ProcessConfig[]>({
    queryKey: ["process-configs"],
    queryFn: () => fetchProcessConfigs(),
  });
}

export function useProcessConfig(id: number) {
  return useQuery<ProcessConfig>({
    queryKey: ["process-config", id],
    queryFn: () => fetchProcessConfig(id),
  });
}
