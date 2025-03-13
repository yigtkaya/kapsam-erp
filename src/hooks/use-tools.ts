import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createTool,
  deleteTool,
  fetchTool,
  fetchTools,
  updateTool,
} from "@/api/tools";
import { Tool } from "@/types/inventory";

export function useTools() {
  return useSuspenseQuery({
    queryKey: ["tools"],
    queryFn: fetchTools,
  });
}

export function useTool(id: number) {
  return useSuspenseQuery({
    queryKey: ["tool", id],
    queryFn: () => fetchTool(id),
  });
}

export function useCreateTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
}

export function useUpdateTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Tool }) =>
      updateTool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
}

export function useDeleteTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTool,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.removeQueries({ queryKey: ["tool", id] });
    },
  });
}
