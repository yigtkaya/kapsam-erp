"use client";

import React, { useState } from "react";
import {
  ClipboardCheck,
  Package,
  Truck,
  BarChart2,
  ChevronLeft,
  Edit,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { SalesOrder, SalesOrderItem, Shipping } from "@/types/sales";
import { Input } from "@/components/ui/input";
import { useBatchUpdateShipments } from "../../hooks/useShipments";
import { useUpdateSalesOrderItems } from "../../hooks/useSalesOrderItems";
import { toast } from "sonner";

interface OrderTrackerProps {
  salesOrder: SalesOrder;
  orderItems: SalesOrderItem[];
  shipments: Shipping[];
  onEditOrder: () => void;
  onCreateShipment: () => void;
  onEditItems: () => void;
  onAddItems: () => void;
  onEditShipments: () => void;
  onAddShipment: () => void;
  onDeleteShipment: (shippingNo: string) => void;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-amber-100 text-amber-800";
      case "CLOSED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
        status
      )}`}
    >
      {status === "OPEN" ? "Bekliyor" : "Tamamlandı"}
    </span>
  );
};

// Progress bar component
const ProgressBar = ({
  percentage,
  color = "bg-blue-500",
}: {
  percentage: number;
  color?: string;
}) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className={`h-2.5 rounded-full ${color}`}
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

// Stats card component
const StatCard = ({
  title,
  value,
  subtext,
  percentage,
  color,
}: {
  title: string;
  value: string | number;
  subtext?: string;
  percentage?: number;
  color?: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <div className="text-sm text-gray-500 mb-1">{title}</div>
    <div className="flex items-end gap-2">
      <div className="text-2xl font-bold">{value}</div>
      {subtext && <div className="text-sm text-gray-500 mb-1">{subtext}</div>}
    </div>
    {percentage !== undefined && (
      <div className="mt-2">
        <ProgressBar percentage={percentage} color={color} />
      </div>
    )}
  </div>
);

// Calculate order completion statistics
const calculateOrderStats = (orderItems: SalesOrderItem[]) => {
  if (!orderItems || orderItems.length === 0) {
    return {
      completionRate: 0,
      shipmentRate: 0,
      totalItems: 0,
      completedItems: 0,
    };
  }

  const totalQuantity = orderItems.reduce(
    (acc, item) => acc + item.ordered_quantity,
    0
  );
  const fulfilledQuantity = orderItems.reduce(
    (acc, item) => acc + (item.fulfilled_quantity || 0),
    0
  );

  return {
    completionRate: Math.round((fulfilledQuantity / totalQuantity) * 100) || 0,
    shipmentRate: Math.round((fulfilledQuantity / totalQuantity) * 100) || 0,
    totalItems: orderItems.length,
    completedItems: orderItems.filter(
      (item) => item.fulfilled_quantity >= item.ordered_quantity
    ).length,
  };
};

const OrderTracker: React.FC<OrderTrackerProps> = ({
  salesOrder,
  orderItems,
  shipments,
  onEditOrder,
  onCreateShipment,
  onEditItems,
  onAddItems,
  onEditShipments,
  onAddShipment,
  onDeleteShipment,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingItems, setIsEditingItems] = useState(false);
  const [isEditingShipments, setIsEditingShipments] = useState(false);
  const router = useRouter();

  // Add state for tracking shipment changes
  const [shipmentChanges, setShipmentChanges] = useState<
    Record<
      string,
      {
        shipping_no?: string;
        shipping_date?: string;
        quantity?: number;
        package_number?: number;
        shipping_note?: string;
      }
    >
  >({});

  // Add state for tracking item changes
  const [itemChanges, setItemChanges] = useState<
    Record<number, Partial<SalesOrderItem>>
  >({});

  // Add mutations for updates
  const { mutate: batchUpdateShipments, isPending: isUpdatingShipments } =
    useBatchUpdateShipments(salesOrder.id);
  const { mutate: updateOrderItems, isPending: isUpdatingItems } =
    useUpdateSalesOrderItems(salesOrder.id);

  const orderStats = calculateOrderStats(orderItems);

  // Handle initiating edit item state and propagating up
  const handleEditItems = () => {
    setIsEditingItems(true);
    onEditItems();
  };

  // Handle initiating edit shipment state and propagating up
  const handleEditShipments = () => {
    setIsEditingShipments(true);
    onEditShipments();
  };

  // Handle shipment field changes
  const handleShipmentFieldChange = (
    shippingNo: string,
    field: string,
    value: string | number
  ) => {
    setShipmentChanges((prev) => ({
      ...prev,
      [shippingNo]: {
        ...(prev[shippingNo] || {}),
        [field]: value,
      },
    }));
  };

  // Handle saving shipment changes
  const handleSaveShipmentChanges = () => {
    // If no changes, show a message and return
    if (Object.keys(shipmentChanges).length === 0) {
      toast.info("Değişiklik yapılmadı");
      setIsEditingShipments(false);
      return;
    }

    // Prepare the updated shipment data
    const updatedShipments = Object.entries(shipmentChanges).map(
      ([shipping_no, changes]) => {
        const shipment = shipments.find((s) => s.shipping_no === shipping_no);

        if (!shipment) {
          throw new Error(`Shipment ${shipping_no} not found`);
        }

        return {
          shipping_no,
          quantity:
            changes.quantity !== undefined
              ? Number(changes.quantity)
              : shipment.quantity,
          shipping_date:
            changes.shipping_date ||
            new Date(shipment.shipping_date).toISOString().split("T")[0],
          shipping_note:
            changes.shipping_note !== undefined
              ? changes.shipping_note
              : shipment.shipping_note || "",
        };
      }
    );

    // Update shipments
    batchUpdateShipments(
      { shipments: updatedShipments },
      {
        onSuccess: () => {
          setShipmentChanges({});
          setIsEditingShipments(false);
          toast.success("Sevkiyatlar başarıyla güncellendi");
        },
        onError: (error) => {
          toast.error("Sevkiyatlar güncellenirken bir hata oluştu");
          console.error(error);
        },
      }
    );
  };

  // Handle item field changes
  const handleItemFieldChange = (
    itemId: number,
    field: keyof SalesOrderItem,
    value: any
  ) => {
    setItemChanges((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [field]: value,
      },
    }));
  };

  // Handle saving item changes
  const handleSaveItemChanges = () => {
    // If no changes, show a message and return
    if (Object.keys(itemChanges).length === 0) {
      toast.info("Değişiklik yapılmadı");
      setIsEditingItems(false);
      return;
    }

    // Prepare the updated item data
    const updatedItems = Object.entries(itemChanges).map(
      ([itemId, changes]) => {
        const item = orderItems.find((i) => i.id === parseInt(itemId));

        if (!item) {
          throw new Error(`Item ${itemId} not found`);
        }

        const formatDate = (
          dateValue: string | null | undefined
        ): string | undefined => {
          if (!dateValue) return undefined;
          try {
            return new Date(dateValue).toISOString().split("T")[0];
          } catch (e) {
            return undefined;
          }
        };

        return {
          id: parseInt(itemId),
          ...(changes.ordered_quantity !== undefined && {
            ordered_quantity: Number(changes.ordered_quantity),
          }),
          ...(changes.deadline_date && {
            deadline_date: formatDate(changes.deadline_date as string),
          }),
          ...(changes.kapsam_deadline_date && {
            kapsam_deadline_date: formatDate(
              changes.kapsam_deadline_date as string
            ),
          }),
          ...(changes.receiving_date && {
            receiving_date: formatDate(changes.receiving_date as string),
          }),
        };
      }
    );

    // Update items
    updateOrderItems(updatedItems, {
      onSuccess: () => {
        setItemChanges({});
        setIsEditingItems(false);
        toast.success("Sipariş kalemleri başarıyla güncellendi");
      },
      onError: (error) => {
        toast.error("Sipariş kalemleri güncellenirken bir hata oluştu");
        console.error(error);
      },
    });
  };

  // Tab rendering
  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4">Sipariş Özeti</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Sipariş No</span>
                  <span className="font-medium">{salesOrder.order_number}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Müşteri</span>
                  <span className="font-medium">
                    {salesOrder.customer_name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Oluşturulma Tarihi</span>
                  <span className="font-medium">
                    {format(new Date(salesOrder.created_at), "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Durum</span>
                  <StatusBadge status={salesOrder.status} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  title="Tamamlama Oranı"
                  value={`${orderStats.completionRate}%`}
                  subtext={`(${orderStats.completedItems}/${orderStats.totalItems})`}
                  percentage={orderStats.completionRate}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Sevkiyat Oranı"
                  value={`${orderStats.shipmentRate}%`}
                  subtext={`(${orderStats.completedItems}/${orderStats.totalItems})`}
                  percentage={orderStats.shipmentRate}
                  color="bg-green-500"
                />
                <StatCard
                  title="Toplam Kalemler"
                  value={orderStats.totalItems}
                  subtext="kalem"
                />
              </div>

              <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium">Durum Özeti</h2>
                </div>
                <div className="space-y-6">
                  {orderItems.map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">
                          {item.product_details?.product_name ||
                            `Ürün #${item.product}`}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.fulfilled_quantity}/{item.ordered_quantity}(
                          {Math.round(
                            (item.fulfilled_quantity / item.ordered_quantity) *
                              100
                          ) || 0}
                          %)
                        </span>
                      </div>
                      <ProgressBar
                        percentage={
                          Math.round(
                            (item.fulfilled_quantity / item.ordered_quantity) *
                              100
                          ) || 0
                        }
                        color="bg-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "items":
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-xl font-medium">
                Sipariş Kalemleri{" "}
                <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded-full">
                  {orderItems.length}
                </span>
              </h2>
              <div className="flex gap-2">
                {isEditingItems ? (
                  <>
                    <button
                      className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-200"
                      onClick={() => {
                        setIsEditingItems(false);
                        setItemChanges({});
                      }}
                    >
                      <span>İptal</span>
                    </button>
                    <button
                      className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600"
                      onClick={handleSaveItemChanges}
                      disabled={isUpdatingItems}
                    >
                      <span>
                        {isUpdatingItems ? "Kaydediliyor..." : "Kaydet"}
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="flex items-center gap-1 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50"
                      onClick={handleEditItems}
                    >
                      <Edit size={16} />
                      <span>Düzenle</span>
                    </button>
                    <button
                      className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100"
                      onClick={onAddItems}
                    >
                      <Plus size={16} />
                      <span>Toplu Kalem Ekle</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Ürün</th>
                    <th className="text-left px-6 py-3 font-medium">Miktar</th>
                    <th className="text-left px-6 py-3 font-medium">Teslim</th>
                    <th className="text-left px-6 py-3 font-medium">
                      Alım Tarihi
                    </th>
                    <th className="text-left px-6 py-3 font-medium">
                      Termin Tarihi
                    </th>
                    <th className="text-left px-6 py-3 font-medium">
                      Kapsam Tarihi
                    </th>
                    <th className="text-left px-6 py-3 font-medium">
                      İlerleme
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orderItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          {item.product_details?.product_name ||
                            `Ürün #${item.product}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.product_details?.product_code || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isEditingItems ? (
                          <Input
                            type="number"
                            className="w-20 h-9"
                            min={1}
                            defaultValue={item.ordered_quantity}
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.id,
                                "ordered_quantity",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        ) : (
                          item.ordered_quantity
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.fulfilled_quantity || 0}
                      </td>
                      <td className="px-6 py-4">
                        {isEditingItems ? (
                          <Input
                            type="date"
                            className="w-32 h-9"
                            defaultValue={
                              item.receiving_date
                                ? new Date(item.receiving_date)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.id,
                                "receiving_date",
                                e.target.value
                              )
                            }
                          />
                        ) : item.receiving_date ? (
                          format(new Date(item.receiving_date), "dd/MM/yyyy")
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditingItems ? (
                          <Input
                            type="date"
                            className="w-32 h-9"
                            defaultValue={
                              item.deadline_date
                                ? new Date(item.deadline_date)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.id,
                                "deadline_date",
                                e.target.value
                              )
                            }
                          />
                        ) : item.deadline_date ? (
                          format(new Date(item.deadline_date), "dd/MM/yyyy")
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditingItems ? (
                          <Input
                            type="date"
                            className="w-32 h-9"
                            defaultValue={
                              item.kapsam_deadline_date
                                ? new Date(item.kapsam_deadline_date)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              handleItemFieldChange(
                                item.id,
                                "kapsam_deadline_date",
                                e.target.value
                              )
                            }
                          />
                        ) : item.kapsam_deadline_date ? (
                          format(
                            new Date(item.kapsam_deadline_date),
                            "dd/MM/yyyy"
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span>
                            {Math.round(
                              (item.fulfilled_quantity /
                                item.ordered_quantity) *
                                100
                            ) || 0}
                            %
                          </span>
                          {item.fulfilled_quantity / item.ordered_quantity ===
                            0 && (
                            <AlertCircle size={16} className="text-amber-500" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "shipments":
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-xl font-medium">
                Sevkiyatlar{" "}
                <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded-full">
                  {shipments.length}
                </span>
              </h2>
              <div className="flex gap-2">
                {isEditingShipments ? (
                  <>
                    <button
                      className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-200"
                      onClick={() => {
                        setIsEditingShipments(false);
                        setShipmentChanges({});
                      }}
                    >
                      <span>İptal</span>
                    </button>
                    <button
                      className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600"
                      onClick={handleSaveShipmentChanges}
                      disabled={isUpdatingShipments}
                    >
                      <span>
                        {isUpdatingShipments ? "Kaydediliyor..." : "Kaydet"}
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="flex items-center gap-1 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50"
                      onClick={handleEditShipments}
                    >
                      <Edit size={16} />
                      <span>Düzenle</span>
                    </button>
                    <button
                      className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100"
                      onClick={onAddShipment}
                    >
                      <Plus size={16} />
                      <span>Yeni Sevkiyat</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">
                      Sevkiyat No
                    </th>
                    <th className="text-left px-6 py-3 font-medium">Tarih</th>
                    <th className="text-left px-6 py-3 font-medium">Miktar</th>
                    <th className="text-left px-6 py-3 font-medium">
                      Paket No
                    </th>
                    <th className="text-left px-6 py-3 font-medium">Not</th>
                    <th className="text-left px-6 py-3 font-medium">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shipments.map((shipment) => (
                    <tr key={shipment.shipping_no} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {isEditingShipments ? (
                          <Input
                            className="w-32 h-9"
                            defaultValue={shipment.shipping_no}
                            disabled={true}
                          />
                        ) : (
                          shipment.shipping_no
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditingShipments ? (
                          <Input
                            type="date"
                            className="w-32 h-9"
                            defaultValue={
                              new Date(shipment.shipping_date)
                                .toISOString()
                                .split("T")[0]
                            }
                            onChange={(e) =>
                              handleShipmentFieldChange(
                                shipment.shipping_no,
                                "shipping_date",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          format(new Date(shipment.shipping_date), "dd/MM/yyyy")
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditingShipments ? (
                          <Input
                            type="number"
                            className="w-20 h-9"
                            min={1}
                            defaultValue={shipment.quantity}
                            onChange={(e) =>
                              handleShipmentFieldChange(
                                shipment.shipping_no,
                                "quantity",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        ) : (
                          shipment.quantity
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditingShipments ? (
                          <Input
                            type="number"
                            className="w-20 h-9"
                            min={1}
                            defaultValue={shipment.package_number}
                            onChange={(e) =>
                              handleShipmentFieldChange(
                                shipment.shipping_no,
                                "package_number",
                                parseInt(e.target.value)
                              )
                            }
                            disabled={true}
                          />
                        ) : (
                          shipment.package_number
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditingShipments ? (
                          <Input
                            className="w-40 h-9"
                            defaultValue={shipment.shipping_note || ""}
                            placeholder="Not ekleyin"
                            onChange={(e) =>
                              handleShipmentFieldChange(
                                shipment.shipping_no,
                                "shipping_note",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          shipment.shipping_note || "-"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {!isEditingShipments && (
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              onDeleteShipment(shipment.shipping_no)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Tamamlama Oranı"
                value={`${orderStats.completionRate}%`}
                subtext={`(${orderStats.completedItems}/${orderStats.totalItems})`}
                percentage={orderStats.completionRate}
                color="bg-blue-500"
              />
              <StatCard
                title="Sevkiyat Oranı"
                value={`${orderStats.shipmentRate}%`}
                subtext={`(${orderStats.completedItems}/${orderStats.totalItems})`}
                percentage={orderStats.shipmentRate}
                color="bg-green-500"
              />
              <StatCard
                title="Toplam Kalemler"
                value={orderStats.totalItems}
                subtext="kalem"
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4">
                Detaylı İstatistikler
              </h2>
              <div className="space-y-6">
                {orderItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">
                        {item.product_details?.product_name ||
                          `Ürün #${item.product}`}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.fulfilled_quantity}/{item.ordered_quantity}(
                        {Math.round(
                          (item.fulfilled_quantity / item.ordered_quantity) *
                            100
                        ) || 0}
                        %)
                      </span>
                    </div>
                    <ProgressBar
                      percentage={
                        Math.round(
                          (item.fulfilled_quantity / item.ordered_quantity) *
                            100
                        ) || 0
                      }
                      color="bg-amber-500"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-500 mb-1">Tamamlanan</div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span>{orderStats.completedItems}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-500 mb-1">Gecikmiş</div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <span>
                        {
                          orderItems.filter(
                            (item) =>
                              new Date(item.deadline_date) < new Date() &&
                              item.fulfilled_quantity < item.ordered_quantity
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-500 mb-1">Bu Hafta</div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                      <span>
                        {
                          orderItems.filter((item) => {
                            const deadline = new Date(item.deadline_date);
                            const today = new Date();
                            const nextWeek = new Date();
                            nextWeek.setDate(today.getDate() + 7);
                            return deadline >= today && deadline <= nextWeek;
                          }).length
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-500 mb-1">Bu Ay</div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>
                        {
                          orderItems.filter((item) => {
                            const deadline = new Date(item.deadline_date);
                            const today = new Date();
                            const nextMonth = new Date();
                            nextMonth.setMonth(today.getMonth() + 1);
                            return deadline >= today && deadline <= nextMonth;
                          }).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Tab navigation items
  const tabs = [
    {
      id: "overview",
      label: "Genel Bakış",
      icon: <ClipboardCheck size={18} />,
    },
    { id: "items", label: "Sipariş Kalemleri", icon: <Package size={18} /> },
    { id: "shipments", label: "Sevkiyatlar", icon: <Truck size={18} /> },
    { id: "stats", label: "İstatistikler", icon: <BarChart2 size={18} /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => router.push("/sales")}
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                Sipariş #{salesOrder.order_number}
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={onEditOrder}
                >
                  <Edit size={16} />
                </button>
              </h1>
              <div className="text-sm text-gray-500">
                {salesOrder.customer_name} -{" "}
                {format(new Date(salesOrder.created_at), "dd/MM/yyyy")}
              </div>
            </div>
            <div className="ml-auto">
              <Link href={`/sales/${salesOrder.id}/create-shipment`}>
                <Button
                  variant="default"
                  className="gap-2 bg-blue-500 hover:bg-blue-600"
                >
                  <Truck className="h-4 w-4" />
                  Sevkiyat Oluştur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex overflow-x-auto mb-6 bg-white rounded-lg shadow-sm border border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {renderTab()}
      </div>
    </div>
  );
};

export default OrderTracker;
