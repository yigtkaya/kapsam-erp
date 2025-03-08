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
import { Truck, Pencil, ArrowLeft, BarChart2 } from "lucide-react";
import Link from "next/link";
import { SalesOrderItem, Shipping } from "@/types/sales";
import { useSalesOrder, useUpdateSalesOrder } from "../hooks/useSalesOrders";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
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
import { Separator } from "@/components/ui/separator";
import { CalendarIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { useSalesOrderItems } from "../hooks/useSalesOrderItems";
import {
  useShipment,
  useCreateShipment,
  useDeleteShipment,
} from "../hooks/useShipments";

const formSchema = z.object({
  deadline_date: z.string().min(1, "Deadline date is required"),
  status: z.string().min(1, "Status is required"),
  items: z.array(
    z.object({
      id: z.string(),
      ordered_quantity: z.number().min(1, "Ordered quantity is required"),
      deadline_date: z.string().min(1, "Deadline date is required"),
      kapsam_deadline_date: z
        .string()
        .min(1, "Kapsam deadline date is required"),
      receiving_date: z.string().min(1, "Order receiving date is required"),
    })
  ),
});

function ShipmentsTable({ shipments }: { shipments: Shipping[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sevkiyatlar</CardTitle>
        <Badge variant="outline">{shipments.length}</Badge>
      </CardHeader>
      <CardContent>
        {shipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Truck className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              Henüz sevkiyat oluşturulmamış
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sevkiyat No</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">Miktar</TableHead>
                <TableHead className="text-right">Paket Sayısı</TableHead>
                <TableHead>Not</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell>{shipment.shipping_no}</TableCell>
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
                  <TableCell>{shipment.shipping_note || "-"}</TableCell>
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

function OrderItemsTable({
  items,
  shipments,
}: {
  items: SalesOrderItem[];
  shipments: Shipping[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sipariş Kalemleri</CardTitle>
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
              <TableHead className="text-right">Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const shippedQuantity = shipments.reduce(
                (acc, shipment) =>
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
                    {item.ordered_quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.fulfilled_quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.ordered_quantity - item.fulfilled_quantity}
                  </TableCell>
                  <TableCell className="text-right">{currentStock}</TableCell>
                  <TableCell className="text-right">
                    {item.ordered_quantity === item.fulfilled_quantity ? (
                      <Badge
                        variant="outline"
                        className="text-blue-600 border-blue-600 bg-blue-50"
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
                      <Badge variant="destructive">Stok Yetersiz</Badge>
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

function OrderStatistics({ order }: { order: any }) {
  const totalOrderQuantity = order.items.reduce(
    (acc: number, item: SalesOrderItem) => acc + item.ordered_quantity,
    0
  );

  const totalShippedQuantity = calculateTotalQuantity(order.shipments);
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
                {order.shipments.length > 0
                  ? new Date(
                      order.shipments[order.shipments.length - 1].shipping_date
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
  const [itemChanges, setItemChanges] = useState<{
    [key: number]: Partial<SalesOrderItem>;
  }>({});

  const { data: order, isLoading, error } = useSalesOrder(orderId);
  const { mutate: updateOrder } = useUpdateSalesOrder();
  const { updateItem, isUpdatingItem } = useSalesOrderItems(orderId);
  const { mutate: createShipment } = useCreateShipment(orderId);
  const { mutate: deleteShipment } = useDeleteShipment(orderId);

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
          deadline_date: item.deadline_date,
          kapsam_deadline_date: item.kapsam_deadline_date,
          receiving_date: item.receiving_date,
        })),
      });
    }
  }, [order, form]);

  // Return 404 if no orderId is provided
  if (!orderId) {
    notFound();
  }

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
      // Update each changed item
      await Promise.all(
        Object.entries(itemChanges).map(([itemId, changes]) =>
          updateItem({
            itemId: parseInt(itemId),
            data: changes,
          })
        )
      );

      // Clear changes and exit edit mode
      setItemChanges({});
      setIsEditing(false);
      router.replace(`/sales/${orderId}`);
    } catch (error) {
      console.error("Failed to update items:", error);
    }
  };

  const handleCancelEdit = () => {
    setItemChanges({});
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
        />
        <div className="flex gap-3">
          {!isEditing ? (
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
          )}
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Sipariş İstatistikleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Toplam Ürün
                  </p>
                  <p className="text-2xl font-bold">{totalOrderQuantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Kalan Miktar
                  </p>
                  <p className="text-2xl font-bold">
                    {totalOrderQuantity - totalShippedQuantity}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Sevk Edilen
                  </p>
                  <p className="text-2xl font-bold">{totalShippedQuantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Son Sevkiyat
                  </p>
                  <p className="text-2xl font-bold">
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
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Tamamlanma Oranı
                </p>
                <p className="text-sm font-medium">{completionPercentage}%</p>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Order Items Table */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sipariş Kalemleri</CardTitle>
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
                  <TableHead className="text-right">
                    Sipariş Alınan Tarih
                  </TableHead>
                  <TableHead className="text-right">
                    Sipariş Teslim Tarihi
                  </TableHead>
                  <TableHead className="text-right">
                    Kapsam Son Teslim Tarihi
                  </TableHead>
                  <TableHead className="text-right">Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item: SalesOrderItem) => {
                  const shippedQuantity = order.shipments.reduce(
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
                              itemChanges[item.id]?.ordered_quantity !==
                              undefined
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
                      <TableCell className="text-right">
                        {currentStock}
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditing ? (
                          <Input
                            type="date"
                            value={
                              itemChanges[item.id]?.receiving_date
                                ? new Date(
                                    itemChanges[item.id]
                                      .receiving_date as string
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
                          format(
                            new Date(item.kapsam_deadline_date),
                            "dd.MM.yyyy"
                          )
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.ordered_quantity === item.fulfilled_quantity ? (
                          <Badge
                            variant="outline"
                            className="text-blue-600 border-blue-600 bg-blue-50"
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
                          <Badge variant="destructive">Stok Yetersiz</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Shipments Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sevkiyatlar</CardTitle>
            <Badge variant="secondary">{order.shipments.length}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            {order.shipments.length === 0 ? (
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
                  {order.shipments.map((shipment: Shipping) => (
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
      </div>
    </div>
  );
}
