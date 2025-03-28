import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Machine, ManufacturingProcess, WorkOrder } from "@/types/manufacture";
import {
  fetchMachines,
  fetchMachine,
  createMachine,
  updateMachine,
  deleteMachine,
} from "@/api/machines";
import {
  fetchProcesses,
  fetchProcess,
  createProcess,
  updateProcess,
  deleteProcess,
} from "@/api/manufacturing-processes";
import {
  fetchWorkOrders,
  fetchWorkOrder,
  createWorkOrder,
  updateWorkOrder,
  deleteWorkOrder,
} from "@/api/work-orders";

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
    queryFn: () => fetchMachine(id.toString()),
    enabled: !!id,
  });
}

export function useCreateMachine() {
  const queryClient = useQueryClient();

  return useMutation<Machine, Error, Machine>({
    mutationFn: (data) => createMachine(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
}

export function useUpdateMachine() {
  const queryClient = useQueryClient();

  return useMutation<Machine, Error, Machine>({
    mutationFn: (data) => updateMachine(data).then((res) => res.data),
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
