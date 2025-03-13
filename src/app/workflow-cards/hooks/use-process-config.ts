import {
  fetchProcessConfigs,
  fetchProcessConfig,
  createProcessConfig,
  updateProcessConfig,
  deleteProcessConfig,
} from "@/api/manufacturing";
import { ProcessConfig } from "@/types/manufacture";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

// Process Config hooks
export function useProcessConfigs(workflowProcessId?: number) {
  return useQuery<ProcessConfig[]>({
    queryKey: workflowProcessId
      ? ["processConfigs", workflowProcessId]
      : ["processConfigs"],
    queryFn: () => fetchProcessConfigs(workflowProcessId),
  });
}

export function useProcessConfig(id: number) {
  return useQuery<ProcessConfig>({
    queryKey: ["processConfig", id],
    queryFn: () => fetchProcessConfig(id),
  });
}

export function useCreateProcessConfig() {
  const queryClient = useQueryClient();

  return useMutation<
    ProcessConfig,
    Error,
    Omit<ProcessConfig, "id" | "created_at" | "updated_at">
  >({
    mutationFn: (data) => createProcessConfig(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
      if (typeof data.workflow_process === "number") {
        queryClient.invalidateQueries({
          queryKey: ["processConfigs", data.workflow_process],
        });
      }
    },
  });
}

export function useUpdateProcessConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; data: Partial<ProcessConfig> }) =>
      updateProcessConfig(params.id, params.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
      queryClient.invalidateQueries({
        queryKey: ["processConfig", variables.id],
      });
      if (typeof data.workflow_process === "number") {
        queryClient.invalidateQueries({
          queryKey: ["processConfigs", data.workflow_process],
        });
      }
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
