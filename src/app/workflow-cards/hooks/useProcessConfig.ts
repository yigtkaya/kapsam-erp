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
} from "../api/process-configs";

export function useProcessConfigs() {
  return useQuery<ProcessConfig[]>({
    queryKey: ["processConfigs"],
    queryFn: () => fetchProcessConfigs(),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
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
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
      queryClient.invalidateQueries({
        queryKey: ["processConfig", variables.id],
      });
    },
  });
}

export function useDeleteProcessConfig() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (id) => deleteProcessConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
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
    },
  });
}

export function useCreateNewProcessConfigVersion() {
  const queryClient = useQueryClient();

  return useMutation<ProcessConfig, Error, number>({
    mutationFn: (id) => createNewProcessConfigVersion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processConfigs"] });
    },
  });
}
