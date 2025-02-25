import { useQuery } from "@tanstack/react-query";
import { BOMProcessConfig } from "@/types/manufacture";
import { fetchProcessConfig, fetchProcessConfigs } from "@/api/process-comp";

export function useProcessConfigs() {
  return useQuery<BOMProcessConfig[]>({
    queryKey: ["processConfigs"],
    queryFn: () => fetchProcessConfigs(),
  });
}

export function useProcessConfig(id: string) {
  return useQuery<BOMProcessConfig>({
    queryKey: ["processConfig", id],
    queryFn: () => fetchProcessConfig(Number(id)),
  });
}
