import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateSalesOrderRequest, SalesOrder } from "@/types/sales";
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
    mutationFn: (data: CreateSalesOrderRequest) => createSalesOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales-orders"],
        exact: true,
        refetchType: "all",
      });
    },
    onError: () => {},
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
    },
    onError: () => {},
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
    mutationFn: async (id: string) => {
      await deleteSalesOrder(id);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["sales-orders"] });
      await queryClient.cancelQueries({ queryKey: ["sales-order", id] });

      const previousOrders = queryClient.getQueryData(["sales-orders"]);

      queryClient.setQueryData(["sales-orders"], (old: any) =>
        Array.isArray(old) ? old.filter((order: any) => order.id !== id) : old
      );

      return { previousOrders };
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      queryClient.removeQueries({ queryKey: ["sales-order", id] });
      toast.success("Satış siparişi başarıyla silindi");
    },
    onError: (error, id, context: any) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["sales-orders"], context.previousOrders);
      }
      console.error("Delete error:", error);
      toast.error("Satış siparişi silinirken bir hata oluştu");
    },
  });
}
