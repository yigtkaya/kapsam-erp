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
import { Truck, Pencil } from "lucide-react";
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

const formSchema = z.object({
  deadline_date: z.string().min(1, "Deadline date is required"),
  status: z.string().min(1, "Status is required"),
  kapsam_deadline_date: z.string().min(1, "Kapsam deadline date is required"),
  order_receiving_date: z.string().min(1, "Order receiving date is required"),
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
                  shipment.order_item === item.id?.toString()
                    ? acc + shipment.quantity
                    : acc,
                0
              );

              const remainingQuantity = item.quantity - shippedQuantity;
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
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {item.fulfilled_quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.quantity - item.fulfilled_quantity}
                  </TableCell>
                  <TableCell className="text-right">{currentStock}</TableCell>
                  <TableCell className="text-right">
                    {item.quantity === item.fulfilled_quantity ? (
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
    (acc: number, item: SalesOrderItem) => acc + item.quantity,
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
            <div className="h-2 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>
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
  const { mutate: updateOrder } = useUpdateSalesOrder();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deadline_date: "",
      status: "",
      order_receiving_date: "",
      kapsam_deadline_date: "",
    },
  });

  useEffect(() => {
    if (order) {
      form.reset({
        deadline_date: order.deadline_date.split("T")[0],
        status: order.status,
        order_receiving_date: order.order_receiving_date.split("T")[0],
        kapsam_deadline_date: order.kapsam_deadline_date.split("T")[0],
      });
    }
  }, [order, form]);

  // Return 404 if no orderId is provided
  if (!orderId) {
    notFound();
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const updateData = {
        deadline_date: values.deadline_date,
        status: values.status as any,
        order_receiving_date: values.order_receiving_date,
        kapsam_deadline_date: values.kapsam_deadline_date,
      };

      console.log(updateData);

      updateOrder({ id: orderId, data: updateData });
      setIsEditing(false);
      router.replace(`/sales/${orderId}`);
    } catch (error) {
      console.error("Failed to update order:", error);
    }
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

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <PageHeader title="Sipariş Detayları" showBackButton />
        </div>
        <div className="flex items-center gap-4">
          {!isEditing ? (
            <>
              <Button
                onClick={() => {
                  setIsEditing(true);
                  router.push(`/sales/${orderId}?edit=true`);
                }}
                variant="outline"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Siparişi Düzenle
              </Button>
              <Button asChild>
                <Link href={`/sales/${orderId}/create-shipment`}>
                  <Truck className="mr-2 h-4 w-4" />
                  Sevkiyat Oluştur
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  router.replace(`/sales/${orderId}`);
                }}
                variant="outline"
              >
                İptal
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)}>
                Değişiklikleri Kaydet
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sipariş Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {!isEditing ? (
              <>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Sipariş Numarası</span>
                  <span>{order.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Müşteri</span>
                  <span>{order.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Durum</span>
                  <Badge
                    variant={order.status === "OPEN" ? "default" : "secondary"}
                  >
                    {order.status_display}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Sipariş Tarihi</span>
                  <span>
                    {new Date(order.order_date).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Termin Tarihi</span>
                  <span>
                    {new Date(order.deadline_date).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    Kapsam Termin Tarihi
                  </span>
                  <span>
                    {order.kapsam_deadline_date
                      ? new Date(order.kapsam_deadline_date).toLocaleDateString(
                          "tr-TR"
                        )
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    Sipariş Teslim Tarihi
                  </span>
                  <span>
                    {order.order_receiving_date
                      ? new Date(order.order_receiving_date).toLocaleDateString(
                          "tr-TR"
                        )
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Toplam Sevkiyat</span>
                  <span>{order.shipments.length} Sevkiyat</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    Toplam Sevkiyat Miktarı
                  </span>
                  <span>{calculateTotalQuantity(order.shipments)}</span>
                </div>
              </>
            ) : (
              <Form {...form}>
                <form className="space-y-4">
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
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Durum Seçiniz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CLOSED">Kapalı</SelectItem>
                            <SelectItem value="OPEN">Açık</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deadline_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kapsam Termin Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="order_receiving_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sipariş Teslim Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kapsam_deadline_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kapsam Teslim Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <OrderStatistics order={order} />

        <OrderItemsTable items={order.items} shipments={order.shipments} />

        <ShipmentsTable shipments={order.shipments} />
      </div>
    </div>
  );
}
