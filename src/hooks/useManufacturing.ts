import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Machine,
  ManufacturingProcess,
  WorkOrder,
  WorkflowProcess,
  ProcessConfig,
} from "@/types/manufacture";
import {
  createMachine,
  deleteMachine,
  fetchMachine,
  fetchMachines,
  updateMachine,
  createProcess,
  deleteProcess,
  fetchProcess,
  fetchProcesses,
  updateProcess,
  createWorkOrder,
  deleteWorkOrder,
  fetchWorkOrder,
  fetchWorkOrders,
  updateWorkOrder,
  fetchWorkflowProcess,
  fetchWorkflowProcesses,
  createWorkflowProcess,
  updateWorkflowProcess,
  deleteWorkflowProcess,
  fetchProcessConfig,
  fetchProcessConfigs,
  createProcessConfig,
  updateProcessConfig,
  deleteProcessConfig,
} from "@/api/manufacturing";

// Machine hooks
export function useMachines() {
  return useQuery<Machine[]>({
    queryKey: ["machines"],
    queryFn: () => fetchMachines(),
  });
}

export function useMachine(id: number) {
  return useQuery<Machine>({
    queryKey: ["machine", id],
    queryFn: () => fetchMachine(id),
    enabled: !!id,
  });
}

export function useCreateMachine() {
  const queryClient = useQueryClient();

  return useMutation<
    Machine,
    Error,
    Omit<Machine, "id" | "created_at" | "updated_at">
  >({
    mutationFn: (data) => createMachine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
}

export function useUpdateMachine() {
  const queryClient = useQueryClient();

  return useMutation<Machine, Error, { id: number; data: Partial<Machine> }>({
    mutationFn: ({ id, data }) => updateMachine(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      queryClient.invalidateQueries({ queryKey: ["machine", variables.id] });
    },
  });
}

export function useDeleteMachine() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (id) => deleteMachine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
}

// Manufacturing Process hooks
export function useProcesses() {
  return useQuery<ManufacturingProcess[]>({
    queryKey: ["processes"],
    queryFn: () => fetchProcesses(),
  });
}

export function useProcess(id: number) {
  return useQuery<ManufacturingProcess>({
    queryKey: ["process", id],
    queryFn: () => fetchProcess(id),
    enabled: !!id,
  });
}

export function useCreateProcess() {
  const queryClient = useQueryClient();

  return useMutation<
    ManufacturingProcess,
    Error,
    Omit<ManufacturingProcess, "id" | "created_at" | "updated_at">
  >({
    mutationFn: (data) => createProcess(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processes"] });
    },
  });
}

export function useUpdateProcess() {
  const queryClient = useQueryClient();

  return useMutation<
    ManufacturingProcess,
    Error,
    { id: number; data: Partial<ManufacturingProcess> }
  >({
    mutationFn: ({ id, data }) => updateProcess(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["processes"] });
      queryClient.invalidateQueries({ queryKey: ["process", variables.id] });
    },
  });
}

export function useDeleteProcess() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (id) => deleteProcess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processes"] });
    },
  });
}

// Work Order hooks
export function useWorkOrders() {
  return useQuery<WorkOrder[]>({
    queryKey: ["workOrders"],
    queryFn: () => fetchWorkOrders(),
  });
}

export function useWorkOrder(id: number) {
  return useQuery<WorkOrder>({
    queryKey: ["workOrder", id],
    queryFn: () => fetchWorkOrder(id),
    enabled: !!id,
  });
}

export function useCreateWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation<
    WorkOrder,
    Error,
    Omit<WorkOrder, "id" | "created_at" | "updated_at">
  >({
    mutationFn: (data) => createWorkOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
    },
  });
}

export function useUpdateWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation<
    WorkOrder,
    Error,
    { id: number; data: Partial<WorkOrder> }
  >({
    mutationFn: ({ id, data }) => updateWorkOrder(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["workOrder", variables.id] });
    },
  });
}

export function useDeleteWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (id) => deleteWorkOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
    },
  });
}

// Workflow Process hooks
export function useWorkflowProcesses(productId?: string) {
  return useQuery<WorkflowProcess[]>({
    queryKey: productId
      ? ["workflowProcesses", productId]
      : ["workflowProcesses"],
    queryFn: () => fetchWorkflowProcesses(productId),
  });
}

export function useWorkflowProcess(id: number) {
  return useQuery<WorkflowProcess>({
    queryKey: ["workflowProcess", id],
    queryFn: () => fetchWorkflowProcess(id),
    enabled: !!id,
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
