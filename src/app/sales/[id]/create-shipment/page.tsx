"use client";

import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateShipment } from "../../hooks/useShipments";
import { PageHeader } from "@/components/ui/page-header";
import { useSalesOrder } from "../../hooks/useSalesOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { CreateShipmentRequest, SalesOrderItem } from "@/types/sales";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SelectedItemData {
  quantity: number;
  packages: number;
}

const ShipmentItemSchema = z.object({
  order_item: z.string(),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  package_number: z.number().min(1, "Package number must be greater than 0"),
  lot_number: z.string().optional(),
  serial_numbers: z.array(z.string()).optional(),
});

const formSchema = z.object({
  shipping_date: z.string().min(1, "Shipping date is required"),
  shipping_note: z.string().optional(),
});

export default function CreateShipmentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { data: order, isLoading } = useSalesOrder(orderId);
  const { mutate: createShipment } = useCreateShipment();
  const [selectedItems, setSelectedItems] = useState<
    Record<string, SelectedItemData>
  >({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipping_date: new Date().toISOString().split("T")[0],
      shipping_note: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (Object.keys(selectedItems).length === 0) {
      toast.error("Please select at least one item for shipment");
      return;
    }

    // Calculate total packages
    const totalPackages = Object.values(selectedItems).reduce(
      (sum, item) => sum + item.packages,
      0
    );

    const shipmentData: CreateShipmentRequest = {
      shipping_date: values.shipping_date,
      shipping_amount: totalPackages,
      shipping_note: values.shipping_note || undefined,
      order: orderId,
      items: Object.entries(selectedItems).flatMap(([itemId, itemData]) => {
        const { quantity, packages } = itemData;
        const itemsPerPackage = Math.floor(quantity / packages);
        const remainder = quantity % packages;

        return Array.from({ length: packages }, (_, index) => ({
          order_item: itemId,
          quantity: index < remainder ? itemsPerPackage + 1 : itemsPerPackage,
          package_number: index + 1,
          lot_number: undefined,
          serial_numbers: [],
        }));
      }),
    };

    createShipment(shipmentData, {
      onSuccess: () => {
        toast.success("Shipment created successfully");
        router.back();
      },
      onError: (error: any) => {
        if (error.response?.data) {
          const errorData = error.response.data;
          if (errorData.items) {
            errorData.items.forEach((itemError: any, index: number) => {
              if (itemError.non_field_errors) {
                toast.error(
                  `Item ${index + 1}: ${itemError.non_field_errors.join(", ")}`
                );
              }
            });
          } else {
            toast.error(JSON.stringify(errorData));
          }
        } else {
          toast.error("Failed to create shipment. Please try again.");
        }
      },
    });
  }

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = order?.items.find(
      (i: SalesOrderItem) => i.id?.toString() === itemId
    );
    if (!item) return;

    const remainingQuantity = item.quantity - (item.fulfilled_quantity || 0);
    if (quantity > remainingQuantity) {
      quantity = remainingQuantity;
    }

    if (quantity <= 0) {
      const newSelectedItems = { ...selectedItems };
      delete newSelectedItems[itemId];
      setSelectedItems(newSelectedItems);
    } else {
      setSelectedItems((prev) => ({
        ...prev,
        [itemId]: {
          quantity,
          packages: prev[itemId]?.packages || 1,
        },
      }));
    }
  };

  const handlePackagesChange = (itemId: string, packages: number) => {
    if (packages < 1) packages = 1;

    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: {
        quantity: prev[itemId]?.quantity || 0,
        packages,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Sipariş bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title="Sevkiyat Oluştur"
        description="Bu sipariş için yeni bir sevkiyat oluşturun"
        showBackButton
        onBack={() => router.replace(`/sales/${params.id}`)}
      />

      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sevkiyat Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="shipping_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sevkiyat Tarihi</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sevkiyat Notu (İsteğe Bağlı)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ek Notları Giriniz"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sevkiyat Edilecek Ürünleri Seçiniz</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ürün</TableHead>
                      <TableHead className="text-right">
                        Toplam Miktar
                      </TableHead>
                      <TableHead className="text-right">Tamamlandı</TableHead>
                      <TableHead className="text-right">Kaldı</TableHead>
                      <TableHead className="text-right">
                        Sevkiyat Miktarı
                      </TableHead>
                      <TableHead className="text-right">Paket Sayısı</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item: SalesOrderItem) => {
                      const remainingQuantity =
                        item.quantity - (item.fulfilled_quantity || 0);
                      if (remainingQuantity <= 0) return null;

                      return (
                        <TableRow key={item.id}>
                          <TableCell>
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
                            {remainingQuantity}
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              min="0"
                              max={remainingQuantity}
                              value={
                                selectedItems[item.id!.toString()]?.quantity ||
                                0
                              }
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id!.toString(),
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-24 ml-auto"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              min="1"
                              value={
                                selectedItems[item.id!.toString()]?.packages ||
                                1
                              }
                              onChange={(e) =>
                                handlePackagesChange(
                                  item.id!.toString(),
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-24 ml-auto"
                              disabled={
                                !selectedItems[item.id!.toString()]?.quantity
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Vazgeç
              </Button>
              <Button
                type="submit"
                disabled={Object.keys(selectedItems).length === 0}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Oluşturuluyor...
                  </div>
                ) : (
                  "Sevkiyat Oluştur"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
