"use client";

import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { getSalesOrder } from "@/api/sales";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Truck, Pencil } from "lucide-react";
import Link from "next/link";
import { SalesOrderItem, Shipping, ShipmentItem } from "@/types/sales";
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
import { UpdateSalesOrderDTO } from "../types";
import { PageHeader } from "@/components/ui/page-header";

const formSchema = z.object({
  deadline_date: z.string().min(1, "Deadline date is required"),
  status: z.string().min(1, "Status is required"),
  kapsam_deadline_date: z.string().min(1, "Kapsam deadline date is required"),
  order_receiving_date: z.string().min(1, "Order receiving date is required"),
});

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
      const updateData: UpdateSalesOrderDTO = {
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
            Loading order details...
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
          <p className="text-sm text-red-500">Failed to load order details</p>
          <Button variant="outline" asChild>
            <Link href="/sales">Back to Sales</Link>
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
                <Link href={`/sales/${order.id}/create-shipment`}>
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
            {isEditing ? (
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
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="PENDING_APPROVAL">
                              Bekliyor
                            </SelectItem>
                            <SelectItem value="APPROVED">Onaylandı</SelectItem>
                            <SelectItem value="COMPLETED">
                              Tamamlandı
                            </SelectItem>
                            <SelectItem value="CANCELLED">
                              İptal Edildi
                            </SelectItem>
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
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">Durum</span>
                  <Badge
                    variant={
                      order.status === "COMPLETED"
                        ? "default"
                        : order.status === "CANCELLED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {order.status_display}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Müşteri</span>
                  <span>{order.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sipariş Tarihi</span>
                  <span>{new Date(order.order_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Kapsam Termin Tarihi</span>
                  <span>
                    {new Date(order.deadline_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sipariş Teslim Tarihi</span>
                  <span>
                    {new Date(order.order_receiving_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Kapsam Teslim Tarihi</span>
                  <span>
                    {new Date(order.kapsam_deadline_date).toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sipariş İstatistikleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Order Progress Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Toplam Ürün
                  </p>
                  <p className="text-2xl font-bold">
                    {order.items.reduce(
                      (acc: number, item: SalesOrderItem) =>
                        acc + item.quantity,
                      0
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Sevk Edilen Ürünler
                  </p>
                  <p className="text-2xl font-bold">
                    {order.shipments.reduce(
                      (acc: number, shipment: Shipping) =>
                        acc +
                        shipment.items.reduce(
                          (itemAcc: number, item: ShipmentItem) =>
                            itemAcc + item.quantity,
                          0
                        ),
                      0
                    )}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Toplam Sevk</span>
                  <span className="font-medium">
                    {Math.round(
                      (order.shipments.reduce(
                        (acc: number, shipment: Shipping) =>
                          acc +
                          shipment.items.reduce(
                            (itemAcc: number, item: ShipmentItem) =>
                              itemAcc + item.quantity,
                            0
                          ),
                        0
                      ) /
                        order.items.reduce(
                          (acc: number, item: SalesOrderItem) =>
                            acc + item.quantity,
                          0
                        )) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${Math.round(
                        (order.shipments.reduce(
                          (acc: number, shipment: Shipping) =>
                            acc +
                            shipment.items.reduce(
                              (itemAcc: number, item: ShipmentItem) =>
                                itemAcc + item.quantity,
                              0
                            ),
                          0
                        ) /
                          order.items.reduce(
                            (acc: number, item: SalesOrderItem) =>
                              acc + item.quantity,
                            0
                          )) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sipariş Ürünleri</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün</TableHead>
                <TableHead className="text-right">Sipariş Edildi</TableHead>
                <TableHead className="text-right">Sevk Edildi</TableHead>
                <TableHead className="text-right">Kalan</TableHead>
                <TableHead className="text-right">Seviye</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item: SalesOrderItem) => {
                const fulfillmentPercentage = Math.round(
                  ((item.fulfilled_quantity || 0) / item.quantity) * 100
                );
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.product_details?.product_name ||
                        `Product #${item.product}`}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.fulfilled_quantity || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity - (item.fulfilled_quantity || 0)}
                    </TableCell>
                    <TableCell className="w-[200px]">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{
                              width: `${fulfillmentPercentage}%`,
                            }}
                          />
                        </div>
                        <span className="w-12 text-sm tabular-nums text-muted-foreground">
                          {fulfillmentPercentage}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sevkler</CardTitle>
          <Badge variant="outline">{order.shipments.length}</Badge>
        </CardHeader>
        <CardContent>
          {order.shipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                Henüz sevk oluşturulmamış
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {order.shipments.map((shipment: Shipping) => (
                <div key={shipment.id} className="space-y-4">
                  {/* Shipment Header */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {shipment.shipping_no}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created on{" "}
                        {new Date(shipment.shipping_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      Tutar: {shipment.shipping_amount}
                    </div>
                  </div>

                  {/* Shipment Items */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Ürünler</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ürün</TableHead>
                          <TableHead className="text-right">Miktar</TableHead>
                          <TableHead>Paket</TableHead>
                          <TableHead>Lot Numarası</TableHead>
                          <TableHead>Seri Numaraları</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shipment.items.map((item: ShipmentItem) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {item.product_details?.product_name ||
                                `Product #${item.product}`}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.quantity}
                            </TableCell>
                            <TableCell>{item.package_number}</TableCell>
                            <TableCell>{item.lot_number || "-"}</TableCell>
                            <TableCell>
                              {item.serial_numbers?.length ? (
                                <div className="flex flex-wrap gap-1">
                                  {item.serial_numbers.map((serial: string) => (
                                    <Badge key={serial} variant="outline">
                                      {serial}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {shipment.shipping_note && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Sevk Notu</h4>
                      <p className="text-sm text-muted-foreground">
                        {shipment.shipping_note}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
