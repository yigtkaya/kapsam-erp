import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchShipment,
  fetchShipments,
  batchUpdateShipments,
  BatchUpdateShipmentRequest,
} from "@/api/shipments";
import { createShipment, deleteShipment } from "@/api/sales";
import { CreateShipmentRequest, Shipping } from "@/types/sales";

export function useShipment(shippingNo: string) {
  return useQuery<Shipping>({
    queryKey: ["shipment", shippingNo],
    queryFn: () => fetchShipment(shippingNo),
  });
}

export function useShipments(orderId: string) {
  return useQuery<Shipping[]>({
    queryKey: ["shipments", orderId],
    queryFn: () => fetchShipments(orderId),
  });
}

export function useCreateShipment(orderId?: string) {
  const queryClient = useQueryClient();

  return useMutation<Shipping, Error, CreateShipmentRequest>({
    mutationFn: async (data: CreateShipmentRequest) => {
      try {
        return await createShipment(data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Sevkiyat oluşturulurken bir hata oluştu");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales-orders"],
        exact: true,
        refetchType: "active",
      });

      if (orderId) {
        queryClient.removeQueries({ queryKey: ["sales-order", orderId] });
      }
      toast.success("Sevkiyat başarıyla oluşturuldu");
    },
  });
}

export function useDeleteShipment(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shipmentId: string) =>
      deleteShipment(shipmentId, Number(orderId)),
    onSuccess: () => {
      // Invalidate the shipments list for this order
      queryClient.invalidateQueries({ queryKey: ["shipments", orderId] });

      // Invalidate the specific sales order to update its state
      queryClient.invalidateQueries({ queryKey: ["sales-order", orderId] });

      // Invalidate the general sales orders list
      queryClient.invalidateQueries({
        queryKey: ["sales-orders"],
        refetchType: "active",
      });

      toast.success("Sevkiyat başarıyla silindi");
    },
    onError: () => {
      toast.error("Sevkiyat silinirken bir hata oluştu");
    },
  });
}

export function useBatchUpdateShipments(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation<Shipping[], Error, BatchUpdateShipmentRequest>({
    mutationFn: async (data: BatchUpdateShipmentRequest) => {
      try {
        return await batchUpdateShipments(orderId, data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Sevkiyatlar güncellenirken bir hata oluştu");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments", orderId] });
      queryClient.invalidateQueries({ queryKey: ["sales-order", orderId] });
      toast.success("Sevkiyatlar başarıyla güncellendi");
    },
  });
}
