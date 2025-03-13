import {
  fetchWorkflowProcesses,
  fetchWorkflowProcess,
  createWorkflowProcess,
  updateWorkflowProcess,
  deleteWorkflowProcess,
  fetchProcessConfigs,
} from "@/api/manufacturing";
import { WorkflowProcess, ProcessConfig } from "@/types/manufacture";
import {
  useQuery,
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";

// Workflow Process hooks
export function useWorkflowProcesses() {
  return useSuspenseQuery<WorkflowProcess[]>({
    queryKey: ["workflowProcesses"],
    queryFn: () => fetchWorkflowProcesses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useWorkflowProcess(id: number) {
  return useSuspenseQuery<WorkflowProcess>({
    queryKey: ["workflowProcess", id],
    queryFn: () => fetchWorkflowProcess(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useProcessConfigs(processId: number) {
  return useQuery<ProcessConfig[]>({
    queryKey: ["processConfigs", processId],
    queryFn: () => fetchProcessConfigs(processId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateWorkflowProcess() {
  const queryClient = useQueryClient();

  return useMutation<
    WorkflowProcess,
    Error,
    Omit<WorkflowProcess, "id" | "created_at" | "updated_at">
  >({
    mutationFn: (data) => createWorkflowProcess(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workflowProcesses"] });
      if (data.product) {
        queryClient.invalidateQueries({
          queryKey: ["workflowProcesses", data.product],
        });
      }
    },
  });
}

export function useUpdateWorkflowProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; data: Partial<WorkflowProcess> }) =>
      updateWorkflowProcess(params.id, params.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workflowProcesses"] });
      queryClient.invalidateQueries({
        queryKey: ["workflowProcess", variables.id],
      });
      if (data.product) {
        queryClient.invalidateQueries({
          queryKey: ["workflowProcesses", data.product],
        });
      }
    },
  });
}

export function useDeleteWorkflowProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkflowProcess,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["workflowProcesses"] });
      queryClient.removeQueries({ queryKey: ["workflowProcess", deletedId] });
    },
  });
}
