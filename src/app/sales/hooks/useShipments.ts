import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shipment } from "../types";
import { toast } from "sonner";
import { fetchShipment } from "@/api/shipments";
import { createShipment, deleteShipment } from "@/api/sales";
import { CreateShipmentRequest } from "@/types/sales";

export function useShipment(shippingNo: string) {
  return useQuery({
    queryKey: ["shipment", shippingNo],
    queryFn: () => fetchShipment(shippingNo),
    enabled: !!shippingNo,
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateShipmentRequest) => {
      try {
        return await createShipment(data);
      } catch (error) {
        // Rethrow the error with the response data
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      queryClient.invalidateQueries({ queryKey: ["shipment"] });
    },
  });
}

export function useDeleteShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShipment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["shipment"] });
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      toast.success("Sevkiyat başarıyla silindi");
    },
    onError: () => {
      toast.error("Sevkiyat silinirken bir hata oluştu");
    },
  });
}
