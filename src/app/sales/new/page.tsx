"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SalesOrder, SalesOrderStatus } from "@/types/sales";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronsUpDown, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import { Customer } from "@/types/customer";
import { PageHeader } from "@/components/ui/page-header";
import { useCreateSalesOrder } from "../hooks/useSalesOrders";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  order_number: z.string().min(1, "Sipariş numarası zorunludur"),
  customer: z.number().min(1, "Müşteri seçimi zorunludur"),
  deadline_date: z.string().min(1, "Termin tarihi zorunludur"),
  order_receiving_date: z.string().min(1, "Sipariş alım tarihi zorunludur"),
  kapsam_deadline_date: z.string().min(1, "Kapsam termin tarihi zorunludur"),
  status: z.enum(["OPEN", "CLOSED"] as const),
  items: z
    .array(
      z.object({
        product: z.number().min(1, "Ürün seçimi zorunludur"),
        quantity: z.number().min(1, "Miktar en az 1 olmalıdır"),
      })
    )
    .min(1, "En az bir kalem girilmelidir"),
});

type FormValues = z.infer<typeof formSchema>;

const statusDisplayMap: Record<SalesOrderStatus, string> = {
  OPEN: "Açık",
  CLOSED: "Kapalı",
};

export default function NewSalesOrderPage() {
  const router = useRouter();
  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();
  const { data: products, isLoading: isLoadingProducts } = useProducts({
    category: "MAMUL",
  });
  const {
    mutateAsync: createSalesOrder,
    isPending: isLoadingCreateSalesOrder,
    error,
  } = useCreateSalesOrder();
  const [customerOpen, setCustomerOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");

  const filteredCustomers = customers?.filter((customer: Customer) => {
    if (!customerSearchQuery) return true;
    const search = customerSearchQuery.toLowerCase().trim();
    return (
      customer.name.toLowerCase().includes(search) ||
      customer.code.toLowerCase().includes(search)
    );
  });

  const filteredProducts = products?.filter((product) => {
    if (!productSearchQuery) return true;
    const search = productSearchQuery.toLowerCase().trim();
    return (
      product.product_name.toLowerCase().includes(search) ||
      product.product_code.toLowerCase().includes(search)
    );
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order_number: "",
      status: "OPEN",
      items: [{ product: 0, quantity: 1 }],
      order_receiving_date: "",
      kapsam_deadline_date: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(values: FormValues) {
    try {
      const payload = {
        order_number: values.order_number,
        customer: values.customer,
        deadline_date: values.deadline_date,
        order_receiving_date: values.order_receiving_date,
        kapsam_deadline_date: values.kapsam_deadline_date,
        status: values.status,
        items: values.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      };
      await createSalesOrder(payload);
      toast.success("Satış siparişi başarıyla oluşturuldu");
      router.back();
    } catch (error) {
      toast.error("Satış siparişi oluşturulamadı");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="container py-8">
        <PageHeader
          title="Yeni Satış Siparişi"
          description="Yeni bir satış siparişi oluşturun"
          showBackButton
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
            <div className="grid gap-6">
              {/* Main Info Section */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">
                    Sipariş Bilgileri
                  </h3>
                  <div className="grid gap-6">
                    {/* Order Number and Customer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="order_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sipariş Numarası</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="SO-2024-001"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Müşteri</FormLabel>
                            <Popover
                              open={customerOpen}
                              onOpenChange={setCustomerOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    disabled={isLoadingCustomers}
                                    className={cn(
                                      "w-full justify-between bg-white",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? customers?.find(
                                          (customer: Customer) =>
                                            customer.id === Number(field.value)
                                        )?.name
                                      : "Müşteri seçin"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-[--radix-popover-trigger-width] p-0"
                                align="start"
                              >
                                <Command>
                                  <CommandInput
                                    placeholder="Müşteri ara..."
                                    value={customerSearchQuery}
                                    onValueChange={setCustomerSearchQuery}
                                  />
                                  <CommandList className="max-h-[200px]">
                                    <CommandEmpty>
                                      Müşteri bulunamadı.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {filteredCustomers?.map(
                                        (customer: Customer) => (
                                          <CommandItem
                                            value={`${customer.name} (${customer.code})`}
                                            key={customer.id}
                                            onSelect={() => {
                                              form.setValue(
                                                "customer",
                                                customer.id
                                              );
                                              setCustomerOpen(false);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                customer.id ===
                                                  Number(field.value)
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {customer.name} ({customer.code})
                                          </CommandItem>
                                        )
                                      )}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Dates Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="order_receiving_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sipariş Alım Tarihi</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="bg-white"
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
                            <FormLabel>Termin Tarihi</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="bg-white"
                              />
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
                            <FormLabel>Kapsam Termin Tarihi</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Status */}
                    <div className="max-w-xs">
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
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Durum seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {(
                                  Object.keys(
                                    statusDisplayMap
                                  ) as SalesOrderStatus[]
                                ).map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {statusDisplayMap[status]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Ürünler</h3>
                    <Button
                      type="button"
                      onClick={() => append({ product: 0, quantity: 1 })}
                      variant="outline"
                      size="sm"
                      className="bg-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ürün Ekle
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid gap-4 grid-cols-1 md:grid-cols-[1fr,120px,40px] items-start bg-white rounded-lg border p-4 hover:border-primary/20 transition-colors"
                      >
                        <FormField
                          control={form.control}
                          name={`items.${index}.product`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Ürün</FormLabel>
                              <Popover
                                open={productOpen}
                                onOpenChange={setProductOpen}
                              >
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      disabled={isLoadingProducts}
                                      className={cn(
                                        "w-full justify-between bg-white",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value
                                        ? products?.find(
                                            (product) =>
                                              product.id === Number(field.value)
                                          )?.product_name
                                        : "Ürün seçin"}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-[--radix-popover-trigger-width] p-0"
                                  align="start"
                                >
                                  <Command>
                                    <CommandInput
                                      placeholder="Ürün ara..."
                                      value={productSearchQuery}
                                      onValueChange={setProductSearchQuery}
                                    />
                                    <CommandList className="max-h-[200px]">
                                      <CommandEmpty>
                                        Ürün bulunamadı.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {filteredProducts?.map((product) => (
                                          <CommandItem
                                            value={`${product.product_name} (${product.product_code})`}
                                            key={product.id}
                                            onSelect={() => {
                                              form.setValue(
                                                `items.${index}.product`,
                                                product.id
                                              );
                                              setProductOpen(false);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                product.id ===
                                                  Number(field.value)
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {product.product_name} (
                                            {product.product_code})
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Miktar</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  {...field}
                                  className="bg-white"
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(index);
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/sales")}
                  className="bg-white"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={isLoadingCreateSalesOrder}
                  className="min-w-[140px]"
                >
                  {isLoadingCreateSalesOrder && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Siparişi Oluştur
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
