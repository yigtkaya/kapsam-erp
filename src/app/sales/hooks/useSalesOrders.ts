import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SalesOrder, SalesOrderItem } from "@/types/sales";
import { toast } from "sonner";
import {
  createSalesOrder,
  deleteSalesOrder,
  getSalesOrder,
  getSalesOrders,
  updateSalesOrder,
} from "@/api/sales";

export function useSalesOrders() {
  return useQuery<SalesOrder[]>({
    queryKey: ["sales-orders"],
    queryFn: async () => {
      const response = await getSalesOrders();
      if (Array.isArray(response)) {
        return response;
      }
      return response.results || [];
    },
  });
}

export function useCreateSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      customer: number;
      deadline_date: string;
      order_receiving_date: string;
      kapsam_deadline_date: string;
      status: string;
      items: Pick<SalesOrderItem, "product" | "quantity">[];
    }) =>
      createSalesOrder({
        ...data,
        customer: data.customer,
        items: data.items.map((item) => ({
          ...item,
          product: item.product,
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales-orders"],
        exact: true,
        refetchType: "all",
      });
      toast.success("Satış siparişi başarıyla oluşturuldu");
    },
    onError: () => {
      toast.error("Failed to create sales order");
    },
  });
}

export function useUpdateSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        deadline_date: string;
        status: string;
      }>;
    }) => updateSalesOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sales-order", id] });
      toast.success("Sales order updated successfully");
    },
    onError: () => {
      toast.error("Failed to update sales order");
    },
  });
}

export function useSalesOrder(id: string) {
  return useQuery({
    queryKey: ["sales-order", id],
    queryFn: () => getSalesOrder(id),
  });
}

export function useDeleteSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSalesOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      queryClient.removeQueries({ queryKey: "sales-order", id });
      toast.success("Satış siparişi başarıyla silindi");
    },
    onError: () => {
      toast.error("Satış siparişi silinirken bir hata oluştu");
    },
  });
}
