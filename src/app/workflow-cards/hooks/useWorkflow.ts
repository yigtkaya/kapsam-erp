import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductWorkflow } from "@/types/manufacture";
import {
  fetchWorkflows,
  fetchWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  activateWorkflow,
  createNewWorkflowVersion,
} from "@/app/workflow-cards/api/workflows";

export function useWorkflows() {
  return useQuery<ProductWorkflow[]>({
    queryKey: ["workflows"],
    queryFn: () => fetchWorkflows(),
  });
}

export function useWorkflow(id: number) {
  return useQuery<ProductWorkflow>({
    queryKey: ["workflow", id],
    queryFn: () => fetchWorkflow(id),
    enabled: !!id,
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<
    ProductWorkflow,
    Error,
    Omit<ProductWorkflow, "id" | "created_at" | "updated_at">
  >({
    mutationFn: (data) => createWorkflow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}

export function useUpdateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<
    ProductWorkflow,
    Error,
    { id: number; data: Partial<ProductWorkflow> }
  >({
    mutationFn: ({ id, data }) => updateWorkflow(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["workflow", variables.id] });
    },
  });
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (id) => deleteWorkflow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}

export function useActivateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<ProductWorkflow, Error, number>({
    mutationFn: (id) => activateWorkflow(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["workflow", id] });
    },
  });
}

export function useCreateNewWorkflowVersion() {
  const queryClient = useQueryClient();

  return useMutation<ProductWorkflow, Error, number>({
    mutationFn: (id) => createNewWorkflowVersion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}
