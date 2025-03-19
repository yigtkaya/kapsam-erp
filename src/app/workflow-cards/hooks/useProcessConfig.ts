import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProcessConfig } from "@/types/manufacture";
import {
  fetchProcessConfigs,
  fetchProcessConfig,
  createProcessConfig,
  updateProcessConfig,
  deleteProcessConfig,
  activateProcessConfig,
  createNewProcessConfigVersion,
  fetchProcessConfigsForWorkflow,
} from "../api/process-configs";

export function useProcessConfigs() {
  return useQuery<ProcessConfig[]>({
    queryKey: ["processConfigs"],
    queryFn: () => fetchProcessConfigs(),
  });
}

export function useProcessConfigsForWorkflow(workflowId: number) {
  return useQuery<ProcessConfig[]>({
    queryKey: ["processConfigsForWorkflow", workflowId],
    queryFn: () => fetchProcessConfigsForWorkflow(workflowId),
  });
}

export function useProcessConfig(id: number) {
  return useQuery<ProcessConfig>({
    queryKey: ["processConfig", id],
    queryFn: () => fetchProcessConfig(id),
    enabled: !!id,
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["workflow"] });
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
      queryClient.invalidateQueries({ queryKey: ["processConfig"] });
      queryClient.invalidateQueries({
        queryKey: ["processConfigsForWorkflow", variables.workflow],
      });
    },
  });
}

export function useUpdateProcessConfig() {
  const queryClient = useQueryClient();

  return useMutation<
    ProcessConfig,
    Error,
    { id: number; data: Partial<ProcessConfig> }
  >({
    mutationFn: ({ id, data }) => updateProcessConfig(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["workflow"] });
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
      queryClient.invalidateQueries({
        queryKey: ["processConfig", variables.id],
      });
      if (variables.data.workflow) {
        queryClient.invalidateQueries({
          queryKey: ["processConfigsForWorkflow", variables.data.workflow],
        });
      }
    },
  });
}

export function useDeleteProcessConfig() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (id) => deleteProcessConfig(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["workflow"] });
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
      queryClient.invalidateQueries({ queryKey: ["processConfig"] });
      queryClient.invalidateQueries({
        queryKey: ["processConfigsForWorkflow"],
      });
    },
  });
}

export function useActivateProcessConfig() {
  const queryClient = useQueryClient();

  return useMutation<ProcessConfig, Error, number>({
    mutationFn: (id) => activateProcessConfig(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
      queryClient.invalidateQueries({ queryKey: ["processConfig", id] });
      queryClient.invalidateQueries({
        queryKey: ["processConfigsForWorkflow", id],
      });
    },
  });
}

export function useCreateNewProcessConfigVersion() {
  const queryClient = useQueryClient();

  return useMutation<ProcessConfig, Error, number>({
    mutationFn: (id) => createNewProcessConfigVersion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
      queryClient.invalidateQueries({ queryKey: ["processConfig"] });
      queryClient.invalidateQueries({
        queryKey: ["processConfigsForWorkflow"],
      });
    },
  });
}
