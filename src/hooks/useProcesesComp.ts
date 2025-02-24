import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProcessComponent } from "@/types/manufacture";
import {
  createProcessComponent,
  deleteProcessComponent,
  fetchProcessComponent,
  fetchProcessComponents,
  updateProcessComponent,
} from "@/api/process-comp";

interface UseProcessesCompParams {
  process_config?: string;
  raw_material?: string;
  notes?: string;
  bom?: string;
  sequence_order?: number;
}

export function useProcessComponents() {
  return useQuery<ProcessComponent[]>({
    queryKey: ["process-components"],
    queryFn: () => fetchProcessComponents(),
  });
}

export function useProcessComponent(id: number) {
  return useQuery<ProcessComponent>({
    queryKey: ["process-component", id],
    queryFn: () => fetchProcessComponent(id),
  });
}

export function useCreateProcessComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProcessComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["process-components"] });
    },
  });
}

export function useUpdateProcessComponent(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProcessComponent>) =>
      updateProcessComponent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["process-components"] });
    },
  });
}

export function useDeleteProcessComponent(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProcessComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["process-components"] });

      queryClient.removeQueries({ queryKey: ["process-component", id] });
    },
  });
}
