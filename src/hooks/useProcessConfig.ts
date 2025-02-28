import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProcessConfigs,
  createProcessConfig,
  updateProcessConfig,
  deleteProcessConfig,
  fetchProcessConfig,
  updateMachine,
} from "@/api/manufacturing";
import { BOMProcessConfig } from "@/types/manufacture";

export function useProcessConfigs() {
  return useQuery<BOMProcessConfig[]>({
    queryKey: ["processConfigs"],
    queryFn: () => fetchProcessConfigs(),
  });
}

export function useProcessConfig(id: number) {
  return useQuery<BOMProcessConfig>({
    queryKey: ["processConfig", id],
    queryFn: () => fetchProcessConfig(id),
  });
}

export function useCreateProcessConfig() {
  const queryClient = useQueryClient();

  return useMutation<
    BOMProcessConfig,
    Error,
    Omit<BOMProcessConfig, "id" | "created_at" | "updated_at">
  >({
    mutationFn: (data) => {
      return createProcessConfig(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
    },
  });
}

export function useUpdateProcessConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: number; data: Partial<BOMProcessConfig> }) =>
      updateProcessConfig(params.id, params.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
      queryClient.invalidateQueries({
        queryKey: ["processConfig", variables.id],
      });
    },
  });
}

export function useDeleteProcessConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProcessConfig,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
      queryClient.removeQueries({ queryKey: ["processConfig", deletedId] });
    },
  });
}
