import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMachines,
  fetchMachine,
  createMachine,
  updateMachine,
  deleteMachine,
} from "@/api/machines";
import { Machine } from "@/types/manufacture";

export function useMachines() {
  return useQuery<Machine[]>({
    queryKey: ["machines"],
    queryFn: () => fetchMachines(),
  });
}

export function useMachine(id: string) {
  return useQuery<Machine>({
    queryKey: ["machine", id],
    queryFn: () => fetchMachine(id),
  });
}

export function useCreateMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      queryClient.invalidateQueries({ queryKey: ["machine"] });
    },
  });
}

export function useUpdateMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMachine,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      queryClient.invalidateQueries({
        queryKey: ["machine", data.data.id.toString()],
      });
    },
  });
}

export function useDeleteMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMachine,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      queryClient.removeQueries({ queryKey: ["machine", deletedId] });
    },
  });
}
