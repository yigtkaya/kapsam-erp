import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSalesOrderItem,
  updateSaleOrderItems,
  deleteSalesOrderItem,
  fetchSalesOrderItems,
  SalesOrderItemUpdate,
  batchCreateSalesOrderItems,
} from "@/api/sales";
import { SalesOrderItem } from "@/types/sales";

export function useSalesOrderItems(orderId: string) {
  return useQuery<SalesOrderItem[]>({
    queryKey: ["sales-order-items", orderId],
    queryFn: () => fetchSalesOrderItems(orderId),
    enabled: !!orderId,
  });
}

export function useCreateSalesOrderItem(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<SalesOrderItem, "id" | "product_details">) =>
      createSalesOrderItem(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales-order-items", orderId],
        exact: true,
      });
    },
  });
}

export function useUpdateSalesOrderItems(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SalesOrderItemUpdate[]) =>
      updateSaleOrderItems(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales-order-items", orderId],
        exact: true,
      });
    },
  });
}

export function useDeleteSalesOrderItem(orderId: string, itemId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteSalesOrderItem(orderId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales-order-items", orderId],
        exact: true,
      });
    },
  });
}

export function useBatchCreateSalesOrderItems(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      items: Array<
        Omit<
          SalesOrderItem,
          "id" | "product_details" | "order_id" | "fulfilled_quantity"
        >
      >
    ) => batchCreateSalesOrderItems(orderId, items),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales-order-items", orderId],
        exact: true,
      });
      // Also invalidate the sales order to update the items list
      queryClient.invalidateQueries({
        queryKey: ["sales-order", orderId],
        exact: true,
      });
    },
  });
}
