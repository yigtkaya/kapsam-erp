import {
  createHolder,
  deleteHolder,
  fetchHolders,
  updateHolder,
} from "@/api/holders";
import { Holder } from "@/types/inventory";
import {
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useHolders() {
  return useSuspenseQuery({
    queryKey: ["holders"],
    queryFn: fetchHolders,
  });
}

export function useCreateHolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holders"] });
    },
  });
}

export function useUpdateHolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Holder }) =>
      updateHolder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holders"] });
    },
  });
}

export function useDeleteHolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHolder,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["holders"] });
      queryClient.removeQueries({ queryKey: ["holder", id] });
    },
  });
}
