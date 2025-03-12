import { useQuery } from "@tanstack/react-query";
import { fetchFixtures } from "@/api/fixture";

export function useFixtures() {
  return useQuery({
    queryKey: ["fixtures"],
    queryFn: fetchFixtures,
  });
}
