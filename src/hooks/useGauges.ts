import { useQuery } from "@tanstack/react-query";
import { fetchGauges } from "@/api/gauges";

export function useGauges() {
  return useQuery({
    queryKey: ["gauges"],
    queryFn: fetchGauges,
  });
}
