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
  FormDescription,
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
import { Loader2, Package2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// Import these components manually until we can install them properly
const RadioGroup = ({ value, onValueChange, className, children }: any) => (
  <div className={className} role="radiogroup">
    {children}
  </div>
);

const RadioGroupItem = ({ value, id, ...props }: any) => (
  <input
    type="radio"
    id={id || value}
    name="radio-group"
    value={value}
    checked={props.checked}
    onChange={() => props.onChange && props.onChange({ target: { value } })}
    className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
    {...props}
  />
);

const Label = ({ className, children, htmlFor }: any) => (
  <label className={className} htmlFor={htmlFor}>
    {children}
  </label>
);

const formSchema = z.object({
  shipping_no: z.string().min(1, "Sevkiyat numarası zorunludur"),
  shipping_date: z.string().min(1, "Sevkiyat tarihi zorunludur"),
  shipping_note: z.string().optional(),
  order_item: z.number().min(1, "Lütfen bir ürün seçiniz"),
  quantity: z
    .number()
    .min(1, "Miktar 1'den büyük olmalıdır")
    .max(10000, "Miktar çok yüksek"),
  package_number: z
    .number()
    .min(1, "Paket sayısı 1'den büyük olmalıdır")
    .max(1000, "Paket sayısı çok yüksek"),
});

export default function CreateShipmentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { data: order, isLoading } = useSalesOrder(orderId);
  const { mutate: createShipment, isPending: isCreating } = useCreateShipment();
  const [selectedItem, setSelectedItem] = useState<SalesOrderItem | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipping_no: `SHP-${new Date().getTime().toString().slice(-6)}`,
      shipping_date: new Date().toISOString().split("T")[0],
      shipping_note: "",
      order_item: 0,
      quantity: 1,
      package_number: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedItem) {
      toast.error("Lütfen bir ürün seçiniz");
      return;
    }

    const remainingQuantity =
      selectedItem.ordered_quantity - (selectedItem.fulfilled_quantity || 0);
    if (values.quantity > remainingQuantity) {
      toast.error(
        `Sevk miktarı kalan miktardan (${remainingQuantity}) fazla olamaz`
      );
      return;
    }

    const shipmentData: CreateShipmentRequest = {
      shipping_no: values.shipping_no,
      shipping_date: values.shipping_date,
      shipping_note: values.shipping_note,
      order: orderId,
      order_item: values.order_item,
      quantity: values.quantity,
      package_number: values.package_number,
    };

    createShipment(shipmentData, {
      onSuccess: () => {
        toast.success("Sevkiyat başarıyla oluşturuldu");
        router.back();
      },
      onError: (error: any) => {
        toast.error(error.message || "Sevkiyat oluşturulurken bir hata oluştu");
      },
    });
  }

  const handleItemSelect = (item: SalesOrderItem) => {
    setSelectedItem(item);
    form.setValue("order_item", item.id || 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>Sipariş bulunamadı</AlertDescription>
        </Alert>
      </div>
    );
  }

  const availableItems = order.items.filter(
    (item: SalesOrderItem) =>
      item.ordered_quantity - (item.fulfilled_quantity || 0) > 0
  );

  if (availableItems.length === 0) {
    return (
      <div className="container mx-auto px-8 py-8">
        <PageHeader
          title="Sevkiyat Oluştur"
          description={`${order.order_number} numaralı sipariş için yeni sevkiyat`}
          showBackButton
        />
        <Alert className="mt-6">
          <Package2 className="h-4 w-4" />
          <AlertTitle>Sevkiyat Oluşturulamaz</AlertTitle>
          <AlertDescription>
            Bu siparişte sevk edilebilecek ürün kalmamıştır.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-8">
      <PageHeader
        title="Sevkiyat Oluştur"
        description={`${order.order_number} numaralı sipariş için yeni sevkiyat`}
        showBackButton
      />

      <div className="mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Sevkiyat Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="shipping_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İrsaliye Numarası</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Otomatik oluşturulmuştur, değiştirebilirsiniz
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İrsaliye Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-4">Ürün Seçimi</h3>
                  <RadioGroup
                    value={selectedItem?.id?.toString()}
                    onValueChange={(value: string) => {
                      const item = availableItems.find(
                        (i: SalesOrderItem) => i.id?.toString() === value
                      );
                      if (item) handleItemSelect(item);
                    }}
                    className="space-y-4"
                  >
                    {availableItems.map((item: SalesOrderItem) => {
                      const remainingQuantity =
                        item.ordered_quantity - (item.fulfilled_quantity || 0);
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center space-x-4 rounded-lg border p-4 ${
                            selectedItem?.id === item.id
                              ? "border-primary bg-primary/5"
                              : ""
                          }`}
                        >
                          <RadioGroupItem
                            value={item.id?.toString() || ""}
                            checked={selectedItem?.id === item.id}
                            onChange={() => handleItemSelect(item)}
                          />
                          <Label
                            className="flex-1"
                            htmlFor={item.id?.toString()}
                          >
                            <div className="flex flex-col space-y-1">
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {item.product_details?.product_name}
                                </span>
                                <span className="text-muted-foreground">
                                  Kalan: {remainingQuantity}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Stok:{" "}
                                  {item.product_details?.current_stock || 0}
                                </span>
                                <span
                                  className={`${
                                    (item.product_details?.current_stock || 0) <
                                    remainingQuantity
                                      ? "text-red-500"
                                      : "text-green-500"
                                  }`}
                                >
                                  {(item.product_details?.current_stock || 0) <
                                  remainingQuantity
                                    ? "Stok Yetersiz"
                                    : "Stok Yeterli"}
                                </span>
                              </div>
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {selectedItem && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sevkiyat Miktarı</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max={
                                  selectedItem.ordered_quantity -
                                  (selectedItem.fulfilled_quantity || 0)
                                }
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Maksimum:{" "}
                              {selectedItem.ordered_quantity -
                                (selectedItem.fulfilled_quantity || 0)}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="package_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Paket Sayısı</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                <FormField
                  control={form.control}
                  name="shipping_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sevkiyat Notu</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ek açıklamalar..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                İptal
              </Button>
              <Button type="submit" disabled={isCreating || !selectedItem}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Oluşturuluyor...
                  </>
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
