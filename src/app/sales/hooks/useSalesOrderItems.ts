import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSalesOrderItem,
  updateSalesOrderItem,
  deleteSalesOrderItem,
} from "@/api/sales";
import { SalesOrderItem } from "@/types/sales";
import { toast } from "sonner";

export const useSalesOrderItems = (orderId: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: addItem, isPending: isAddingItem } = useMutation({
    mutationFn: (data: Omit<SalesOrderItem, "id" | "product_details">) =>
      createSalesOrderItem(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesOrder", orderId] });
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      toast.success("Sipariş kalemi başarıyla eklendi");
    },
    onError: () => {
      toast.error("Sipariş kalemi eklenirken bir hata oluştu");
    },
  });

  const { mutateAsync: updateItem, isPending: isUpdatingItem } = useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: number;
      data: Partial<Omit<SalesOrderItem, "id" | "product_details">>;
    }) => updateSalesOrderItem(orderId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesOrder", orderId] });
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      toast.success("Sipariş kalemi başarıyla güncellendi");
    },
    onError: () => {
      toast.error("Sipariş kalemi güncellenirken bir hata oluştu");
    },
  });

  const { mutateAsync: removeItem, isPending: isRemovingItem } = useMutation({
    mutationFn: (itemId: number) => deleteSalesOrderItem(orderId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesOrder", orderId] });
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      toast.success("Sipariş kalemi başarıyla silindi");
    },
    onError: () => {
      toast.error("Sipariş kalemi silinirken bir hata oluştu");
    },
  });

  return {
    addItem,
    updateItem,
    removeItem,
    isAddingItem,
    isUpdatingItem,
    isRemovingItem,
  };
};
