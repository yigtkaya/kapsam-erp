"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CreateSalesOrderDTO } from "../types";
import { createSalesOrder } from "../api/actions";
import { z } from "zod";
import { useFieldArray } from "react-hook-form";
import { useCreateSalesOrder, useSalesOrders } from "../hooks/useSalesOrders";

const salesOrderSchema = z.object({
  customer: z.number().min(1, "Müşteri seçimi zorunludur"),
  deadline_date: z.string().nonempty("Son tarih zorunludur"),
  items: z
    .array(
      z.object({
        product: z.number().min(1, "Ürün seçimi zorunludur"),
        quantity: z.number().min(1, "Miktar en az 1 olmalıdır"),
      })
    )
    .min(1, "En az bir ürün eklenmelidir"),
}) satisfies z.ZodType<CreateSalesOrderDTO>;

export default function NewSalesOrderPage() {
  const router = useRouter();
  const { mutateAsync: createOrder } = useCreateSalesOrder();

  const form = useForm<CreateSalesOrderDTO>({
    resolver: zodResolver(salesOrderSchema),
    defaultValues: {
      customer: 0,
      deadline_date: "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (data: CreateSalesOrderDTO) => {
    try {
      const response = await createOrder(data);
      if (response) {
        toast.success("Satış siparişi başarıyla oluşturuldu");
        router.back();
        router.refresh();
      } else {
        toast.error("Sipariş oluşturulamadı");
      }
    } catch (error) {
      toast.error("Form gönderilirken hata oluştu", {
        description: error instanceof Error ? error.message : "Bilinmeyen hata",
      });
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Yeni Satış Siparişi Oluştur</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Customer and Deadline */}
          <div>
            <h3 className="text-lg font-medium mb-2">Temel Bilgiler</h3>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Müşteri</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Müşteri ID"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teslim Tarihi</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium mb-2">Sipariş Kalemleri</h3>
            <Separator className="mb-4" />

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
              >
                <FormField
                  control={form.control}
                  name={`items.${index}.product`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ürün ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ürün ID"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Miktar</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Miktar"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Kaldır
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ product: 0, quantity: 1 })}
            >
              Kalem Ekle
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Oluşturuluyor..."
              : "Siparişi Oluştur"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
