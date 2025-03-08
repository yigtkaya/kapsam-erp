import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchShipment } from "@/api/shipments";
import { createShipment, deleteShipment } from "@/api/sales";
import { CreateShipmentRequest, Shipping } from "@/types/sales";

export function useShipment(shippingNo: string) {
  return useQuery<Shipping>({
    queryKey: ["shipment", shippingNo],
    queryFn: () => fetchShipment(shippingNo),
    enabled: !!shippingNo,
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
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      queryClient.invalidateQueries({ queryKey: ["shipment"] });
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: ["salesOrder", orderId] });
      }
      toast.success("Sevkiyat başarıyla oluşturuldu");
    },
  });
}

export function useDeleteShipment(orderId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShipment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["shipment"] });
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: ["salesOrder", orderId] });
      }
      toast.success("Sevkiyat başarıyla silindi");
    },
    onError: () => {
      toast.error("Sevkiyat silinirken bir hata oluştu");
    },
  });
}
