import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveSalesOrder,
  cancelSalesOrder,
  createSalesOrder,
  deleteSalesOrder,
  fetchSalesOrder,
  fetchSalesOrders,
  updateSalesOrder,
} from "../api/actions";
import { CreateSalesOrderDTO, SalesOrder, UpdateSalesOrderDTO } from "../types";
import { toast } from "sonner";

export function useSalesOrders() {
  return useQuery<SalesOrder[]>({
    queryKey: ["sales-orders"],
    queryFn: fetchSalesOrders,
  });
}

export function useCreateSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSalesOrderDTO) => createSalesOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      toast.success("Sales order created successfully");
    },
    onError: () => {
      toast.error("Failed to create sales order");
    },
  });
}

export function useUpdateSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSalesOrderDTO }) =>
      updateSalesOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      toast.success("Sales order updated successfully");
    },
    onError: () => {
      toast.error("Failed to update sales order");
    },
  });
}

export function useDeleteSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSalesOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      toast.success("Sales order deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete sales order");
    },
  });
}

export function useApproveSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveSalesOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      toast.success("Sales order approved successfully");
    },
    onError: () => {
      toast.error("Failed to approve sales order");
    },
  });
}

export function useCancelSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelSalesOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      toast.success("Sales order cancelled successfully");
    },
    onError: () => {
      toast.error("Failed to cancel sales order");
    },
  });
}

export function useSalesOrder(id: string) {
  const { data: salesOrder, isLoading } = useQuery({
    queryKey: ["sales-order", id],
    queryFn: () => fetchSalesOrder(id),
  });

  return {
    salesOrder,
    isLoading,
  };
}
