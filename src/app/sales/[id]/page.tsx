"use client";

import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Truck, Pencil, BarChart2, PlusCircle } from "lucide-react";
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
import { useShipments } from "../hooks/useShipments";
import { useUpdateSalesOrderItems } from "../hooks/useSalesOrderItems";
import { toast } from "sonner";
import { useUpdateSalesOrder } from "../hooks/useSalesOrders";
import { SalesOrderItemUpdate } from "@/api/sales";
import { BatchAddItemsDialog } from "./components/BatchAddItemsDialog";

const formSchema = z.object({
  deadline_date: z.string().min(1, "Deadline date is required"),
  status: z.string().min(1, "Status is required"),
  items: z.array(
    z.object({
      id: z.number(),
      ordered_quantity: z.number().min(1, "Ordered quantity is required"),
      deadline_date: z.string().min(1, "Deadline date is required"),
      kapsam_deadline_date: z
        .string()
        .min(1, "Kapsam deadline date is required"),
      receiving_date: z.string().min(1, "Order receiving date is required"),
    })
  ),
});

function ShipmentsTable({ orderId }: { orderId: string }) {
  const { data: shipments = [], isLoading } = useShipments(orderId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sevkiyatlar</CardTitle>
        <Badge variant="secondary">{shipments.length}</Badge>
      </CardHeader>
      <CardContent className="p-0">
        {shipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Truck className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Henüz sevkiyat bulunmamaktadır
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Sevkiyat No</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">Miktar</TableHead>
                <TableHead className="text-right">Paket</TableHead>
                <TableHead>Not</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment: Shipping) => (
                <TableRow key={shipment.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    #{shipment.shipping_no}
                  </TableCell>
                  <TableCell>
                    {new Date(shipment.shipping_date).toLocaleDateString(
                      "tr-TR"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {shipment.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {shipment.package_number}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {shipment.shipping_note || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function calculateTotalQuantity(shipments: Shipping[]): number {
  return shipments.reduce((acc, shipment) => acc + shipment.quantity, 0);
}

function OrderItemsTable({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: orderItems = [], isLoading } = useSalesOrderItems(orderId);
  const { data: shipments = [], isLoading: isShipmentsLoading } =
    useShipments(orderId);
  const { mutate: updateItems, isPending: isUpdating } =
    useUpdateSalesOrderItems(orderId);
  const [isEditing, setIsEditing] = useState(
    searchParams.get("edit") === "true"
  );
  const [itemChanges, setItemChanges] = useState<{
    [key: number]: Partial<SalesOrderItem>;
  }>({});
  const { data: order } = useSalesOrder(orderId);

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
      // Format the updated items to match the expected API structure
      const updatedItems: SalesOrderItemUpdate[] = Object.entries(
        itemChanges
      ).map(([itemId, changes]) => {
        const itemId_num = parseInt(itemId);
        const originalItem = orderItems.find((item) => item.id === itemId_num);

        if (!originalItem) {
          throw new Error(`Item with ID ${itemId} not found`);
        }

        // Format dates to YYYY-MM-DD format
        const formatDate = (
          dateValue: string | null | undefined
        ): string | undefined => {
          if (!dateValue) return undefined;
          // If it's already in YYYY-MM-DD format, return as is
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue;
          // Otherwise, convert to YYYY-MM-DD
          return new Date(dateValue).toISOString().split("T")[0];
        };

        // Create a simplified item object with only the fields that changed
        const item: SalesOrderItemUpdate = {
          id: itemId_num,
          ordered_quantity: changes.ordered_quantity,
          deadline_date:
            changes.deadline_date !== undefined
              ? formatDate(changes.deadline_date)
              : undefined,
          receiving_date:
            changes.receiving_date !== undefined
              ? formatDate(changes.receiving_date)
              : undefined,
          kapsam_deadline_date:
            changes.kapsam_deadline_date !== undefined
              ? formatDate(changes.kapsam_deadline_date)
              : undefined,
        };

        return item;
      });

      if (updatedItems.length === 0) {
        toast.info("Değişiklik yapılmadı");
        return;
      }

      // Log the request body for debugging
      console.log("Updating items:", updatedItems);

      updateItems(updatedItems);
      toast.success("Değişiklikler kaydedildi");
      setItemChanges({});
      setIsEditing(false);
    } catch (error) {
      let errorMessage = "Değişiklikler kaydedilemedi";

      // Try to parse the error message if it's a JSON string
      if (error instanceof Error && error.message) {
        try {
          const parsedError = JSON.parse(error.message);
          if (parsedError.detail) {
            errorMessage = parsedError.detail;
          } else if (parsedError.items) {
            // Handle item-specific errors
            const itemErrors = Object.entries(parsedError.items)
              .map(([index, errors]: [string, any]) => {
                const itemIndex = parseInt(index);
                // Get the item IDs for error reporting
                const itemIds = Object.entries(itemChanges).map(([id]) =>
                  parseInt(id)
                );
                const itemId =
                  itemIndex < itemIds.length ? itemIds[itemIndex] : "unknown";
                const errorMessages = Object.values(errors).flat().join(", ");
                return `Ürün #${itemId}: ${errorMessages}`;
              })
              .join("; ");

            if (itemErrors) {
              errorMessage = itemErrors;
            }
          }
        } catch (e) {
          // If parsing fails, use the original error message
          console.error("Error parsing error message:", e);
        }
      }

      toast.error(errorMessage);
      console.error("Failed to update items:", error);
    }
  };

  const handleCancelEdit = () => {
    setItemChanges({});
    setIsEditing(false);
    router.replace(`/sales/${orderId}`);
  };

  if (isLoading || isShipmentsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sipariş Kalemleri</CardTitle>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                İptal
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={isUpdating || Object.keys(itemChanges).length === 0}
              >
                {isUpdating ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </>
          ) : (
            <>
              {order && (
                <BatchAddItemsDialog
                  orderId={orderId}
                  orderNumber={order.order_number}
                />
              )}
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setIsEditing(true);
                  router.push(`/sales/${orderId}?edit=true`);
                }}
              >
                <Pencil className="h-4 w-4" />
                Düzenle
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ürün</TableHead>
              <TableHead className="text-right">Sipariş Miktarı</TableHead>
              <TableHead className="text-right">Tamamlanan</TableHead>
              <TableHead className="text-right">Kalan</TableHead>
              <TableHead className="text-right">Stok</TableHead>
              <TableHead className="text-right">Sipariş Alınan Tarih</TableHead>
              <TableHead className="text-right">
                Sipariş Teslim Tarihi
              </TableHead>
              <TableHead className="text-right">
                Kapsam Son Teslim Tarihi
              </TableHead>
              <TableHead className="text-center">Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems.map((item: SalesOrderItem) => {
              const shippedQuantity = shipments.reduce(
                (acc: number, shipment: Shipping) =>
                  shipment.order_item === item.id
                    ? acc + shipment.quantity
                    : acc,
                0
              );

              const remainingQuantity =
                item.ordered_quantity - item.fulfilled_quantity;
              const currentStock = item.product_details?.current_stock || 0;
              const hasEnoughStock = currentStock >= remainingQuantity;

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.product_details?.product_name ||
                          "Unknown Product"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.product_details?.product_code || "No Code"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        defaultValue={item.ordered_quantity}
                        value={
                          itemChanges[item.id]?.ordered_quantity !== undefined
                            ? itemChanges[item.id].ordered_quantity
                            : item.ordered_quantity
                        }
                        min={1}
                        className="w-24 text-right"
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
                  </TableCell>
                  <TableCell className="text-right">
                    {item.fulfilled_quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.ordered_quantity - item.fulfilled_quantity}
                  </TableCell>
                  <TableCell className="text-right">{currentStock}</TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="date"
                        value={
                          itemChanges[item.id]?.receiving_date
                            ? new Date(
                                itemChanges[item.id].receiving_date as string
                              )
                                .toISOString()
                                .split("T")[0]
                            : item.receiving_date
                            ? new Date(item.receiving_date)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        className="w-32"
                        onChange={(e) =>
                          handleItemFieldChange(
                            item.id,
                            "receiving_date",
                            e.target.value
                          )
                        }
                      />
                    ) : item.receiving_date ? (
                      format(new Date(item.receiving_date), "dd.MM.yyyy")
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="date"
                        value={
                          itemChanges[item.id]?.deadline_date
                            ? new Date(
                                itemChanges[item.id].deadline_date as string
                              )
                                .toISOString()
                                .split("T")[0]
                            : item.deadline_date
                            ? new Date(item.deadline_date)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        className="w-32"
                        onChange={(e) =>
                          handleItemFieldChange(
                            item.id,
                            "deadline_date",
                            e.target.value
                          )
                        }
                      />
                    ) : item.deadline_date ? (
                      format(new Date(item.deadline_date), "dd.MM.yyyy")
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="date"
                        value={
                          itemChanges[item.id]?.kapsam_deadline_date
                            ? new Date(
                                itemChanges[item.id]
                                  .kapsam_deadline_date as string
                              )
                                .toISOString()
                                .split("T")[0]
                            : item.kapsam_deadline_date
                            ? new Date(item.kapsam_deadline_date)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        className="w-32"
                        onChange={(e) =>
                          handleItemFieldChange(
                            item.id,
                            "kapsam_deadline_date",
                            e.target.value
                          )
                        }
                      />
                    ) : item.kapsam_deadline_date ? (
                      format(new Date(item.kapsam_deadline_date), "dd.MM.yyyy")
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.ordered_quantity === item.fulfilled_quantity ? (
                      <Badge
                        variant="outline"
                        className="text-blue-600 text-center border-blue-600 bg-blue-50"
                      >
                        Tamamlandı
                      </Badge>
                    ) : hasEnoughStock ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600 bg-green-50"
                      >
                        Stok Yeterli
                      </Badge>
                    ) : (
                      <div className="flex justify-center items-center gap-2">
                        <Badge variant="destructive">Stok Yetersiz</Badge>
                        <Button
                          size="sm"
                          className="h-8 bg-green-600 hover:bg-green-700 text-white"
                          asChild
                        >
                          <Link href={`/production/plan/${item.id}`}>
                            <PlusCircle className="h-4 w-4" />
                            Üretim Planla
                          </Link>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function OrderStatistics({ orderId }: { orderId: string }) {
  const { data: orderItems = [], isLoading: isOrderItemsLoading } =
    useSalesOrderItems(orderId);
  const { data: shipments = [], isLoading: isShipmentsLoading } =
    useShipments(orderId);

  if (isOrderItemsLoading || isShipmentsLoading) {
    return <div>Loading...</div>;
  }

  const totalOrderQuantity = orderItems.reduce(
    (acc: number, item: SalesOrderItem) => acc + item.ordered_quantity,
    0
  );

  const totalShippedQuantity = calculateTotalQuantity(shipments);
  const completionPercentage = Math.round(
    (totalShippedQuantity / totalOrderQuantity) * 100
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sipariş İstatistikleri</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Toplam Ürün
              </p>
              <p className="text-2xl font-bold">{totalOrderQuantity}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Sevk Edilen
              </p>
              <p className="text-2xl font-bold">{totalShippedQuantity}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Kalan Miktar
              </p>
              <p className="text-2xl font-bold">
                {totalOrderQuantity - totalShippedQuantity}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Son Sevkiyat
              </p>
              <p className="text-2xl font-bold">
                {shipments.length > 0
                  ? new Date(
                      shipments[shipments.length - 1].shipping_date
                    ).toLocaleDateString("tr-TR")
                  : "-"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tamamlanma Oranı</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SalesOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = params?.id as string;
  const [isEditing, setIsEditing] = useState(
    searchParams.get("edit") === "true"
  );

  const { data: order, isLoading, error } = useSalesOrder(orderId);
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateSalesOrder();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deadline_date: "",
      status: "",
      items: [],
    },
  });

  useEffect(() => {
    if (order) {
      form.reset({
        deadline_date: order.deadline_date,
        status: order.status,
        items: order.items.map((item: SalesOrderItem) => ({
          id: item.id,
          product_id: item.product.toString(),
          ordered_quantity: item.ordered_quantity,
          deadline_date: item.deadline_date || "",
          kapsam_deadline_date: item.kapsam_deadline_date || "",
          receiving_date: item.receiving_date || "",
        })),
      });
    }
  }, [order, form]);

  // Return 404 if no orderId is provided
  if (!orderId) {
    notFound();
  }

  const handleSaveChanges = async () => {
    try {
      const values = form.getValues();
      await updateOrder({
        id: orderId,
        data: {
          status: values.status,
          deadline_date: values.deadline_date,
        },
      });
      toast.success("Sipariş başarıyla güncellendi");
      setIsEditing(false);
      router.replace(`/sales/${orderId}`);
    } catch (error) {
      toast.error("Sipariş güncellenirken bir hata oluştu");
      console.error("Failed to update order:", error);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    if (order) {
      form.reset({
        deadline_date: order.deadline_date,
        status: order.status,
      });
    }
    setIsEditing(false);
    router.replace(`/sales/${orderId}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          <p className="text-sm text-muted-foreground">
            Sipariş detayları yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-red-500">Sipariş detayları yüklenemedi</p>
          <Button variant="outline" asChild>
            <Link href="/sales">Siparişler</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Return 404 if no order is found
  if (!order) {
    notFound();
  }

  const totalOrderQuantity = order.items.reduce(
    (acc: number, item: SalesOrderItem) => acc + item.ordered_quantity,
    0
  );

  const totalShippedQuantity = calculateTotalQuantity(order.shipments);
  const completionPercentage = Math.round(
    (totalShippedQuantity / totalOrderQuantity) * 100
  );

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <PageHeader
          title={`Sipariş #${order.order_number}`}
          description={order.customer_name}
          showBackButton
          onBack={() => router.replace("/sales")}
        />
        <div className="flex gap-3">
          {/* {!isEditing ? (
            <>
              <Button
                onClick={() => {
                  setIsEditing(true);
                  router.push(`/sales/${orderId}?edit=true`);
                }}
                variant="outline"
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Düzenle
              </Button>
              <Button asChild className="gap-2">
                <Link href={`/sales/${orderId}/create-shipment`}>
                  <Truck className="h-4 w-4" />
                  Yeni Sevkiyat
                </Link>
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                İptal
              </Button>
              <Button onClick={handleSaveChanges}>Kaydet</Button>
            </div>
          )} */}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Details Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Sipariş Detayları</CardTitle>
            <Badge
              variant="outline"
              className={cn(
                "uppercase bg-green-50 text-green-700 border-green-200",
                order.status === "CLOSED" &&
                  "bg-rose-50 text-rose-700 border-rose-200"
              )}
            >
              {order.status_display}
            </Badge>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Müşteri
                    </p>
                    <p className="text-sm">{order.customer_name}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Müşteri Cari Kodu
                    </p>
                    <p className="text-sm">
                      {order.items[0].product_details?.multicode ?? "-"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Son Sevkiyat
                    </p>
                    <p className="text-sm">
                      {order.shipments.length > 0
                        ? new Date(
                            order.shipments[
                              order.shipments.length - 1
                            ].shipping_date
                          ).toLocaleDateString("tr-TR")
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durum</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Durum Seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value="CLOSED"
                                className="flex items-center gap-2"
                              >
                                <span className="text-rose-600">●</span> Kapalı
                              </SelectItem>
                              <SelectItem
                                value="OPEN"
                                className="flex items-center gap-2"
                              >
                                <span className="text-green-600">●</span> Açık
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
            )}
          </CardContent>
        </Card>

        {/* Order Statistics */}
        <OrderStatistics orderId={order.id} />

        {/* Order Items Table */}
        <OrderItemsTable orderId={order.id} />

        {/* Shipments Card */}
        <ShipmentsTable orderId={order.id} />
      </div>
    </div>
  );
}
