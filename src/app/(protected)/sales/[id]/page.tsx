"use client";

import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Truck,
  Pencil,
  PlusCircle,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { SalesOrder, SalesOrderItem, Shipping } from "@/types/sales";
import { useSalesOrder } from "../hooks/useSalesOrders";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { useSalesOrderItems } from "../hooks/useSalesOrderItems";
import { useDeleteOrderShipment, useShipments } from "../hooks/useShipments";
import { useUpdateSalesOrderItems } from "../hooks/useSalesOrderItems";
import { toast } from "sonner";
import { useUpdateSalesOrder } from "../hooks/useSalesOrders";
import { SalesOrderItemUpdate } from "@/api/sales";
import { BatchAddItemsDialog } from "./components/BatchAddItemsDialog";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/types/customer";
import { useBatchUpdateShipments } from "../hooks/useShipments";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  status: z.string().min(1, "Status is required"),
  customer: z.number().min(1, "Customer is required"),
});

function ShipmentsTable({ orderId }: { orderId: string }) {
  const { data: shipments = [], isLoading } = useShipments(orderId);
  const { mutate: batchUpdate, isPending: isUpdating } =
    useBatchUpdateShipments(orderId);
  const { mutate: deleteShipment, isPending: isDeleting } =
    useDeleteOrderShipment(orderId);
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deletingShipmentId, setDeletingShipmentId] = useState<string | null>(
    null
  );

  type ShipmentField =
    | "shipping_no"
    | "shipping_date"
    | "quantity"
    | "package_number"
    | "shipping_note";

  interface ShipmentChange {
    shipping_no?: string;
    shipping_date?: string;
    quantity?: number;
    package_number?: number;
    shipping_note?: string;
  }

  const [shipmentChanges, setShipmentChanges] = useState<
    Record<string, ShipmentChange>
  >({});

  const getCurrentValue = (
    shipment: Shipping,
    field: ShipmentField
  ): string => {
    const changes = shipmentChanges[shipment.shipping_no];
    if (!changes) return String(shipment[field] ?? "");
    return String(changes[field] ?? shipment[field] ?? "");
  };

  const handleShipmentFieldChange = (
    shipping_no: string,
    field: ShipmentField,
    value: string | number
  ) => {
    if (!shipping_no) {
      console.error("Invalid shipment number:", shipping_no);
      return;
    }

    setShipmentChanges((prev) => ({
      ...prev,
      [shipping_no]: {
        ...(prev[shipping_no] || {}),
        [field]: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedItems = Object.entries(shipmentChanges).map(
        ([shipping_no, changes]) => {
          const shipment = shipments.find((s) => s.shipping_no === shipping_no);

          if (!shipment) {
            throw new Error(`Shipment ${shipping_no} not found`);
          }

          const updatedShipment = {
            shipping_no,
            quantity: Number(changes.quantity ?? shipment.quantity),
            shipping_date: changes.shipping_date
              ? new Date(changes.shipping_date).toISOString().split("T")[0]
              : new Date(shipment.shipping_date).toISOString().split("T")[0],
            ...(typeof changes.shipping_note === "string" && {
              shipping_note: changes.shipping_note,
            }),
          };

          return updatedShipment;
        }
      );

      if (updatedItems.length === 0) {
        toast.info("Değişiklik yapılmadı");
        return;
      }

      batchUpdate({ shipments: updatedItems });
      setShipmentChanges({});
      setIsEditing(false);
    } catch (error) {
      let errorMessage = "Sevkiyatlar güncellenirken bir hata oluştu";

      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message);
          if (parsedError.detail) {
            errorMessage = parsedError.detail;
          } else if (parsedError.shipments) {
            const shipmentErrors = Object.entries(parsedError.shipments)
              .map(([index, errors]: [string, any]) => {
                const errorMessages = Object.values(errors).flat().join(", ");
                return errorMessages;
              })
              .join("; ");

            if (shipmentErrors) {
              errorMessage = shipmentErrors;
            }
          }
        } catch (e) {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setShipmentChanges({});
    setIsEditing(false);
  };

  const handleDeleteShipment = async (shippingNo: string) => {
    try {
      setDeletingShipmentId(shippingNo);
      deleteShipment(shippingNo);
      toast.success(`Sevkiyat #${shippingNo} başarıyla silindi`);
    } catch (error) {
      console.error("Sevkiyat Silinirken Hata Oluştu", error);
      toast.error("Sevkiyat silinirken bir hata oluştu");
    } finally {
      setDeletingShipmentId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">
            Sevkiyatlar yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Sevkiyatlar</h3>
          <Badge variant="outline" className="ml-2">
            {shipments.length}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 ml-2"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                size="sm"
              >
                İptal
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={isUpdating}
                size="sm"
              >
                {isUpdating ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                disabled={shipments.length === 0}
                size="sm"
                className="h-9 px-3"
              >
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Düzenle
              </Button>
              <Button
                variant="secondary"
                asChild
                size="sm"
                className="h-9 px-3"
              >
                <Link href={`/sales/${orderId}/create-shipment`}>
                  <Truck className="h-3.5 w-3.5 mr-1.5" />
                  Yeni Sevkiyat
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          {shipments.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-gray-50">
              <div className="flex flex-col items-center space-y-2">
                <Truck className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Henüz sevkiyat bulunmuyor
                </p>
                <Button variant="outline" asChild size="sm" className="mt-2">
                  <Link href={`/sales/${orderId}/create-shipment`}>
                    <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                    Yeni Sevkiyat Oluştur
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[180px]">Sevkiyat No</TableHead>
                    <TableHead className="w-[150px]">Tarih</TableHead>
                    <TableHead className="w-[120px]">Miktar</TableHead>
                    <TableHead className="w-[120px]">Paket No</TableHead>
                    <TableHead>Not</TableHead>
                    <TableHead className="w-[100px] text-right">
                      İşlemler
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => (
                    <TableRow key={shipment.shipping_no}>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={getCurrentValue(shipment, "shipping_no")}
                            onChange={(e) =>
                              handleShipmentFieldChange(
                                shipment.shipping_no,
                                "shipping_no",
                                e.target.value
                              )
                            }
                            className="h-8 text-sm"
                          />
                        ) : (
                          <div className="font-medium">
                            {shipment.shipping_no}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={getCurrentValue(shipment, "shipping_date")}
                            onChange={(e) =>
                              handleShipmentFieldChange(
                                shipment.shipping_no,
                                "shipping_date",
                                e.target.value
                              )
                            }
                            className="h-8 text-sm"
                          />
                        ) : (
                          format(new Date(shipment.shipping_date), "dd/MM/yyyy")
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={getCurrentValue(shipment, "quantity")}
                            onChange={(e) =>
                              handleShipmentFieldChange(
                                shipment.shipping_no,
                                "quantity",
                                parseInt(e.target.value)
                              )
                            }
                            className="h-8 text-sm"
                            min={1}
                          />
                        ) : (
                          shipment.quantity
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={getCurrentValue(shipment, "package_number")}
                            onChange={(e) =>
                              handleShipmentFieldChange(
                                shipment.shipping_no,
                                "package_number",
                                parseInt(e.target.value)
                              )
                            }
                            className="h-8 text-sm"
                            min={1}
                          />
                        ) : (
                          shipment.package_number
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={getCurrentValue(shipment, "shipping_note")}
                            onChange={(e) =>
                              handleShipmentFieldChange(
                                shipment.shipping_no,
                                "shipping_note",
                                e.target.value
                              )
                            }
                            className="h-8 text-sm"
                            placeholder="Sevkiyat notu"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            {shipment.shipping_note || "-"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!isEditing && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Sevkiyatı Sil
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bu sevkiyatı silmek istediğinizden emin
                                  misiniz? Bu işlem geri alınamaz.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteShipment(shipment.shipping_no)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deletingShipmentId === shipment.shipping_no
                                    ? "Siliniyor..."
                                    : "Sil"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function calculateTotalQuantity(shipments: Shipping[]): number {
  return shipments.reduce((acc, shipment) => acc + shipment.quantity, 0);
}

function OrderItemsTable({ orderId }: { orderId: string }) {
  const { data: orderItems = [], isLoading } = useSalesOrderItems(orderId);
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { mutate: updateItems, isPending: isUpdating } =
    useUpdateSalesOrderItems(orderId);
  const [itemChanges, setItemChanges] = useState<
    Record<number, Partial<SalesOrderItem>>
  >({});

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

  const handleSaveChanges = async () => {
    try {
      const items = Object.entries(itemChanges).map(([itemId, changes]) => {
        const item = orderItems.find(
          (item) => item.id === parseInt(itemId, 10)
        );

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

        const updatedItem: SalesOrderItemUpdate = {
          id: parseInt(itemId, 10),
          ...(changes.ordered_quantity && {
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

        return updatedItem;
      });

      if (items.length === 0) {
        toast.info("Değişiklik yapılmadı");
        return;
      }

      updateItems(items);
      setItemChanges({});
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update items:", error);
      toast.error("Kalemler güncellenirken bir hata oluştu");
    }
  };

  const handleCancelEdit = () => {
    setItemChanges({});
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">
            Kalemler yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Sipariş Kalemleri</h3>
          <Badge variant="outline" className="ml-2">
            {orderItems.length}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 ml-2"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                size="sm"
              >
                İptal
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={isUpdating}
                size="sm"
              >
                {isUpdating ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                disabled={orderItems.length === 0}
                size="sm"
                className="h-9 px-3"
              >
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Düzenle
              </Button>
              <div className="h-9">
                <BatchAddItemsDialog
                  orderId={orderId}
                  orderNumber={orderItems[0]?.order_number || ""}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          {orderItems.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-gray-50">
              <div className="flex flex-col items-center space-y-2">
                <PlusCircle className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">Henüz kalem bulunmuyor</p>
                <BatchAddItemsDialog orderId={orderId} orderNumber={""} />
              </div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[300px]">Ürün</TableHead>
                    <TableHead className="w-[100px]">Miktar</TableHead>
                    <TableHead className="w-[100px]">Teslim</TableHead>
                    <TableHead className="w-[130px]">Alım Tarihi</TableHead>
                    <TableHead className="w-[130px]">Termin Tarihi</TableHead>
                    <TableHead className="w-[130px]">Kapsam Tarihi</TableHead>
                    <TableHead className="w-[80px]">İlerleme</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => {
                    const fulfillmentPercentage =
                      item.ordered_quantity > 0
                        ? Math.round(
                            (item.fulfilled_quantity / item.ordered_quantity) *
                              100
                          )
                        : 0;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {item.product_details?.product_name ||
                                "Ürün bulunamadı"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.product_details?.product_code || ""}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={
                                itemChanges[item.id]?.ordered_quantity !==
                                undefined
                                  ? itemChanges[item.id].ordered_quantity
                                  : item.ordered_quantity
                              }
                              onChange={(e) =>
                                handleItemFieldChange(
                                  item.id,
                                  "ordered_quantity",
                                  parseInt(e.target.value)
                                )
                              }
                              className="h-8 text-sm"
                              min={1}
                            />
                          ) : (
                            <div className="font-medium">
                              {item.ordered_quantity}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`font-medium ${
                              item.fulfilled_quantity >= item.ordered_quantity
                                ? "text-green-600"
                                : item.fulfilled_quantity > 0
                                ? "text-amber-600"
                                : "text-gray-500"
                            }`}
                          >
                            {item.fulfilled_quantity}
                          </div>
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={
                                itemChanges[item.id]?.receiving_date !==
                                undefined
                                  ? (itemChanges[item.id]
                                      .receiving_date as string)
                                  : item.receiving_date
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
                              className="h-8 text-sm"
                            />
                          ) : item.receiving_date ? (
                            format(new Date(item.receiving_date), "dd/MM/yyyy")
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={
                                itemChanges[item.id]?.deadline_date !==
                                undefined
                                  ? (itemChanges[item.id]
                                      .deadline_date as string)
                                  : new Date(item.deadline_date)
                                      .toISOString()
                                      .split("T")[0]
                              }
                              onChange={(e) =>
                                handleItemFieldChange(
                                  item.id,
                                  "deadline_date",
                                  e.target.value
                                )
                              }
                              className="h-8 text-sm"
                            />
                          ) : (
                            format(new Date(item.deadline_date), "dd/MM/yyyy")
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={
                                itemChanges[item.id]?.kapsam_deadline_date !==
                                undefined
                                  ? (itemChanges[item.id]
                                      .kapsam_deadline_date as string)
                                  : item.kapsam_deadline_date
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
                              className="h-8 text-sm"
                            />
                          ) : item.kapsam_deadline_date ? (
                            format(
                              new Date(item.kapsam_deadline_date),
                              "dd/MM/yyyy"
                            )
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="relative w-full h-2 bg-muted overflow-hidden rounded-full">
                              <div
                                className={`absolute h-full left-0 ${
                                  fulfillmentPercentage === 100
                                    ? "bg-green-500"
                                    : fulfillmentPercentage > 0
                                    ? "bg-amber-500"
                                    : "bg-gray-300"
                                }`}
                                style={{ width: `${fulfillmentPercentage}%` }}
                              />
                            </div>
                            <span className="text-xs w-7 text-muted-foreground">
                              {fulfillmentPercentage}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OrderStatistics({ orderId }: { orderId: string }) {
  const { data: salesOrder, isLoading } = useSalesOrder(orderId);
  const { data: shipments = [] } = useShipments(orderId);

  if (isLoading || !salesOrder) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">
            İstatistikler yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  const totalOrderedQuantity = salesOrder.items.reduce(
    (acc, item) => acc + item.ordered_quantity,
    0
  );

  const totalFulfilledQuantity = salesOrder.items.reduce(
    (acc, item) => acc + item.fulfilled_quantity,
    0
  );

  const totalShippedQuantity = calculateTotalQuantity(shipments);

  const completionPercentage =
    totalOrderedQuantity > 0
      ? Math.round((totalFulfilledQuantity / totalOrderedQuantity) * 100)
      : 0;

  const shippingPercentage =
    totalOrderedQuantity > 0
      ? Math.round((totalShippedQuantity / totalOrderedQuantity) * 100)
      : 0;

  // Group items by deadline status
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const itemsByDeadlineStatus = salesOrder.items.reduce(
    (acc, item) => {
      const deadlineDate = new Date(item.deadline_date);
      deadlineDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.ceil(
        (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (item.fulfilled_quantity >= item.ordered_quantity) {
        acc.completed++;
      } else if (daysDiff < 0) {
        acc.overdue++;
      } else if (daysDiff <= 7) {
        acc.dueThisWeek++;
      } else if (daysDiff <= 30) {
        acc.dueThisMonth++;
      } else {
        acc.dueLater++;
      }

      return acc;
    },
    {
      completed: 0,
      overdue: 0,
      dueThisWeek: 0,
      dueThisMonth: 0,
      dueLater: 0,
    }
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tamamlama Oranı */}
        <div className="bg-white border rounded-lg p-4">
          <span className="text-sm font-medium text-muted-foreground">
            Tamamlama Oranı
          </span>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-semibold">
              {completionPercentage}%
            </span>
            <span className="ml-2 text-sm text-muted-foreground">
              ({totalFulfilledQuantity}/{totalOrderedQuantity})
            </span>
          </div>
          <div className="mt-3 relative h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute h-full left-0 ${
                completionPercentage === 100
                  ? "bg-green-500"
                  : completionPercentage > 75
                  ? "bg-emerald-500"
                  : completionPercentage > 50
                  ? "bg-amber-500"
                  : completionPercentage > 25
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Sevkiyat Oranı */}
        <div className="bg-white border rounded-lg p-4">
          <span className="text-sm font-medium text-muted-foreground">
            Sevkiyat Oranı
          </span>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-semibold">
              {shippingPercentage}%
            </span>
            <span className="ml-2 text-sm text-muted-foreground">
              ({totalShippedQuantity}/{totalOrderedQuantity})
            </span>
          </div>
          <div className="mt-3 relative h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute h-full left-0 ${
                shippingPercentage === 100
                  ? "bg-green-500"
                  : shippingPercentage > 75
                  ? "bg-emerald-500"
                  : shippingPercentage > 50
                  ? "bg-amber-500"
                  : shippingPercentage > 25
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${shippingPercentage}%` }}
            />
          </div>
        </div>

        {/* Toplam Kalemler */}
        <div className="bg-white border rounded-lg p-4">
          <span className="text-sm font-medium text-muted-foreground">
            Toplam Kalemler
          </span>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-semibold">
              {salesOrder.items.length}
            </span>
            <span className="ml-2 text-sm text-muted-foreground">kalem</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
              <span>Tamamlanan: {itemsByDeadlineStatus.completed}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div>
              <span>Gecikmiş: {itemsByDeadlineStatus.overdue}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></div>
              <span>Bu Hafta: {itemsByDeadlineStatus.dueThisWeek}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>
              <span>Bu Ay: {itemsByDeadlineStatus.dueThisMonth}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kalem Bazında İlerleme */}
      {salesOrder.items.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-medium">Kalem Bazında İlerleme</h3>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="space-y-4">
              {salesOrder.items.map((item) => {
                const itemProgress =
                  item.ordered_quantity > 0
                    ? Math.round(
                        (item.fulfilled_quantity / item.ordered_quantity) * 100
                      )
                    : 0;

                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate max-w-[250px]">
                        {item.product_details?.product_name ||
                          "Ürün bulunamadı"}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {item.fulfilled_quantity}/{item.ordered_quantity} (
                        {itemProgress}%)
                      </span>
                    </div>
                    <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full left-0 ${
                          itemProgress === 100
                            ? "bg-green-500"
                            : itemProgress > 0
                            ? "bg-amber-500"
                            : "bg-gray-300"
                        }`}
                        style={{ width: `${itemProgress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function SalesOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const { data: salesOrder, isLoading: isOrderLoading } = useSalesOrder(id);
  const { data: shipments = [] } = useShipments(id);
  const [expandedSections, setExpandedSections] = useState<{
    orderDetails: boolean;
    orderItems: boolean;
    shipments: boolean;
  }>({
    orderDetails: true,
    orderItems: true,
    shipments: true,
  });
  const [activeTab, setActiveTab] = useState<
    "overview" | "items" | "shipments" | "statistics"
  >("overview");
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const { mutate: updateSalesOrder, isPending: isOrderUpdating } =
    useUpdateSalesOrder();
  const { data: customers = [] } = useCustomers();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
      customer: 0,
    },
  });

  useEffect(() => {
    if (salesOrder) {
      form.reset({
        status: salesOrder.status,
        customer: salesOrder.customer,
      });
    }
  }, [salesOrder, form]);

  const handleSaveChanges = async () => {
    const values = form.getValues();
    try {
      updateSalesOrder({
        id,
        data: {
          status: values.status,
          customer: values.customer,
        },
      });
      setIsEditingOrder(false);
      toast.success("Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  const handleCancelEdit = () => {
    if (salesOrder) {
      form.reset({
        status: salesOrder.status,
        customer: salesOrder.customer,
      });
    }
    setIsEditingOrder(false);
  };

  if (isOrderLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!salesOrder) {
    return notFound();
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200";
      case "CLOSED":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  return (
    <div className="overflow-x-hidden">
      <div className="mx-auto py-4 space-y-6 px-4">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-2">
            <PageHeader
              title={`Sipariş #${salesOrder.order_number}`}
              description={`${salesOrder.customer_name} - ${format(
                new Date(salesOrder.created_at),
                "dd/MM/yyyy"
              )}`}
              showBackButton
              onBack={() => router.push("/sales")}
            />

            <div className="flex items-center gap-2 self-end lg:self-auto">
              {/* <Badge
                className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(
                  salesOrder.status
                )}`}
              >
                {salesOrder.status === "OPEN" ? "Bekliyor" : "Tamamlandı"}
              </Badge>

              <Link href={`/sales/${id}/create-shipment`}>
                <Button variant="outline" className="gap-2">
                <Truck className="h-4 w-4" />
                  Sevkiyat Oluştur
            </Button>
              </Link> */}

              <Button
                variant={isEditingOrder ? "secondary" : "outline"}
                size="icon"
                onClick={() => setIsEditingOrder(!isEditingOrder)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                className={`px-3 rounded-none ${
                  activeTab === "overview" ? "border-b-2 border-primary" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Genel Bakış
              </Button>
              <Button
                variant="ghost"
                className={`px-3 rounded-none ${
                  activeTab === "items" ? "border-b-2 border-primary" : ""
                }`}
                onClick={() => setActiveTab("items")}
              >
                Sipariş Kalemleri
              </Button>
              <Button
                variant="ghost"
                className={`px-3 rounded-none ${
                  activeTab === "shipments" ? "border-b-2 border-primary" : ""
                }`}
                onClick={() => setActiveTab("shipments")}
              >
                Sevkiyatlar
              </Button>
              <Button
                variant="ghost"
                className={`px-3 rounded-none ${
                  activeTab === "statistics" ? "border-b-2 border-primary" : ""
                }`}
                onClick={() => setActiveTab("statistics")}
              >
                İstatistikler
              </Button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border shadow-sm p-4">
                    <h3 className="text-base font-medium mb-4">
                      Sipariş Özeti
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Sipariş No
                        </span>
                        <span className="font-medium">
                          {salesOrder.order_number}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Müşteri</span>
                        <span className="font-medium">
                          {salesOrder.customer_name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Oluşturulma Tarihi
                        </span>
                        <span className="font-medium">
                          {format(
                            new Date(salesOrder.created_at),
                            "dd/MM/yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Durum</span>
                        <Badge
                          className={`${getStatusBadgeColor(
                            salesOrder.status
                          )}`}
                        >
                          {salesOrder.status === "OPEN"
                            ? "Bekliyor"
                            : "Tamamlandı"}
                        </Badge>
                      </div>
                      {salesOrder.approved_by && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            Onaylayan
                          </span>
                          <span className="font-medium">
                            {salesOrder.approved_by}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-base font-medium mb-4">
                      Özet İstatistikler
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Tamamlama Oranı */}
                      <div className="bg-white border rounded-lg p-4">
                        <span className="text-sm font-medium text-muted-foreground">
                          Tamamlama Oranı
                        </span>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-2xl font-semibold">
                            {salesOrder.items && salesOrder.items.length > 0
                              ? Math.round(
                                  (salesOrder.items.reduce(
                                    (acc, item) =>
                                      acc + (item.fulfilled_quantity || 0),
                                    0
                                  ) /
                                    salesOrder.items.reduce(
                                      (acc, item) =>
                                        acc + (item.ordered_quantity || 0),
                                      0
                                    )) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                      </div>

                      {/* Sevkiyat Oranı */}
                      <div className="bg-white border rounded-lg p-4">
                        <span className="text-sm font-medium text-muted-foreground">
                          Sevkiyat Oranı
                        </span>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-2xl font-semibold">
                            {salesOrder.items && salesOrder.items.length > 0
                              ? Math.round(
                                  (calculateTotalQuantity(shipments || []) /
                                    salesOrder.items.reduce(
                                      (acc, item) =>
                                        acc + (item.ordered_quantity || 0),
                                      0
                                    )) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                      </div>

                      {/* Toplam Kalemler */}
                      <div className="bg-white border rounded-lg p-4">
                        <span className="text-sm font-medium text-muted-foreground">
                          Toplam Kalemler
                        </span>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-2xl font-semibold">
                            {salesOrder.items?.length || 0}
                          </span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            kalem
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Items Tab */}
            {activeTab === "items" && <OrderItemsTable orderId={id} />}

            {/* Shipments Tab */}
            {activeTab === "shipments" && <ShipmentsTable orderId={id} />}

            {/* Statistics Tab */}
            {activeTab === "statistics" && (
              <div className="space-y-6">
                <h3 className="text-base font-medium mb-4">
                  Detaylı İstatistikler
                </h3>
                <OrderStatistics orderId={id} />
              </div>
            )}
          </div>

          {/* Order Edit Form */}
          {isEditingOrder && (
            <div className="mb-6 bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-base font-medium">
                  Sipariş Detaylarını Düzenle
                </h3>
              </div>
              <div className="p-4">
                <Form {...form}>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Müşteri</FormLabel>
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              disabled={isOrderUpdating}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Müşteri Seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {customers.map((customer: Customer) => (
                                  <SelectItem
                                    key={customer.id}
                                    value={customer.id.toString()}
                                  >
                                    {customer.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Durum</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isOrderUpdating}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Durum Seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="OPEN">Bekliyor</SelectItem>
                                <SelectItem value="CLOSED">
                                  Tamamlandı
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </div>
              <div className="p-4 border-t flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isOrderUpdating}
                >
                  İptal
                </Button>
                <Button
                  variant="primary-blue"
                  onClick={handleSaveChanges}
                  disabled={isOrderUpdating}
                >
                  {isOrderUpdating ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
