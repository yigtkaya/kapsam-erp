import { useQuery } from "@tanstack/react-query";
import { BOM } from "@/types/manufacture";

async function fetchBOMs(): Promise<BOM[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boms`);
  if (!response.ok) {
    throw new Error("Failed to fetch BOMs");
  }
  return response.json();
}

export function useBOMs() {
  return useQuery({
    queryKey: ["boms"],
    queryFn: fetchBOMs,
  });
}
