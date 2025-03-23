import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchShipment,
  fetchShipments,
  batchUpdateShipments,
  BatchUpdateShipmentRequest,
  deleteOrderShipment,
  createOrderShipment,
  CreateOrderShipmentPayload,
} from "@/api/shipments";
import { Shipping } from "@/types/sales";

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

/**
 * Hook for deleting a shipment that's associated with a specific order
 * @param orderId - The ID of the sales order
 */
export function useDeleteOrderShipment(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shippingNo: string) =>
      deleteOrderShipment(orderId, shippingNo),
    onSuccess: () => {
      // Force refetch the shipments list for this order to ensure latest data
      queryClient.removeQueries({ queryKey: ["shipments", orderId] });
      queryClient.fetchQuery({ queryKey: ["shipments", orderId] });

      // Force refetch the specific sales order to update its state
      queryClient.removeQueries({ queryKey: ["sales-order", orderId] });
      queryClient.fetchQuery({ queryKey: ["sales-order", orderId] });

      // Force refetch the general sales orders list
      queryClient.removeQueries({ queryKey: ["sales-orders"] });
      queryClient.fetchQuery({ queryKey: ["sales-orders"] });

      toast.success("Sevkiyat başarıyla silindi");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Sevkiyat silinirken bir hata oluştu";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook for creating a shipment for a specific order
 * @param orderId - The ID of the sales order
 */
export function useCreateOrderShipment(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation<Shipping, Error, CreateOrderShipmentPayload>({
    mutationFn: async (data: CreateOrderShipmentPayload) => {
      try {
        return await createOrderShipment(orderId, data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Sevkiyat oluşturulurken bir hata oluştu");
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      // Force refetch the shipments list for this order to ensure latest data
      queryClient.removeQueries({ queryKey: ["shipments", orderId] });
      queryClient.fetchQuery({ queryKey: ["shipments", orderId] });

      // Force refetch the specific sales order to update its state
      queryClient.removeQueries({ queryKey: ["sales-order", orderId] });
      queryClient.fetchQuery({ queryKey: ["sales-order", orderId] });

      // Force refetch the general sales orders list
      queryClient.removeQueries({ queryKey: ["sales-orders"] });
      queryClient.fetchQuery({ queryKey: ["sales-orders"] });

      toast.success("Sevkiyat başarıyla oluşturuldu");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Sevkiyat oluşturulurken bir hata oluştu";
      toast.error(errorMessage);
    },
  });
}
