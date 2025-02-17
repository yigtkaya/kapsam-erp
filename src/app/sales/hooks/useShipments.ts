import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrderShipments,
  fetchShipmentPerformanceMetrics,
  markShipmentDelivered,
  updateShipmentStatus,
  updateShipmentTracking,
} from "../api/shipment-actions";
import { toast } from "sonner";

export function useOrderShipments(orderId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["order-shipments", orderId],
    queryFn: () => fetchOrderShipments(orderId),
  });

  return {
    shipments: data?.shipments ?? [],
    metrics: data?.metrics,
    isLoading,
  };
}

export function useShipmentPerformanceMetrics() {
  const { data, isLoading } = useQuery({
    queryKey: ["shipment-performance-metrics"],
    queryFn: fetchShipmentPerformanceMetrics,
  });

  return {
    metrics: data,
    isLoading,
  };
}

export function useShipmentMutations() {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: ({
      shipmentId,
      status,
    }: {
      shipmentId: string;
      status: string;
    }) => updateShipmentStatus(shipmentId, status),
    onSuccess: (_, { shipmentId }) => {
      queryClient.invalidateQueries({ queryKey: ["order-shipments"] });
      queryClient.invalidateQueries({
        queryKey: ["shipment-performance-metrics"],
      });
      toast.success("Shipment status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update shipment status");
    },
  });

  const { mutate: updateTracking, isPending: isUpdatingTracking } = useMutation(
    {
      mutationFn: ({
        shipmentId,
        data,
      }: {
        shipmentId: string;
        data: {
          tracking_number?: string;
          carrier?: string;
          carrier_service?: string;
          estimated_delivery_date?: string;
        };
      }) => updateShipmentTracking(shipmentId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["order-shipments"] });
        toast.success("Shipment tracking updated successfully");
      },
      onError: () => {
        toast.error("Failed to update shipment tracking");
      },
    }
  );

  const { mutate: markDelivered, isPending: isMarkingDelivered } = useMutation({
    mutationFn: ({
      shipmentId,
      data,
    }: {
      shipmentId: string;
      data: {
        actual_delivery_date: string;
        delivery_status?: string;
      };
    }) => markShipmentDelivered(shipmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-shipments"] });
      queryClient.invalidateQueries({
        queryKey: ["shipment-performance-metrics"],
      });
      toast.success("Shipment marked as delivered successfully");
    },
    onError: () => {
      toast.error("Failed to mark shipment as delivered");
    },
  });

  return {
    updateStatus,
    updateTracking,
    markDelivered,
    isUpdatingStatus,
    isUpdatingTracking,
    isMarkingDelivered,
  };
}
