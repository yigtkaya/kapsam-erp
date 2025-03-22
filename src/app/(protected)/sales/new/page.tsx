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
import {
  SalesOrder,
  SalesOrderStatus,
  CreateSalesOrderRequest,
} from "@/types/sales";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateProductDialog } from "@/components/dialogs/create-product-dialog";
import { Product } from "@/types/inventory";

const formSchema = z.object({
  order_number: z.string().min(1, "Sipariş numarası zorunludur"),
  customer: z.number().min(1, "Müşteri seçimi zorunludur"),
  status: z.enum(["OPEN", "CLOSED"] as const),
  items: z
    .array(
      z.object({
        product: z.number().min(1, "Ürün seçimi zorunludur"),
        ordered_quantity: z.number().min(1, "Miktar en az 1 olmalıdır"),
        deadline_date: z.string().min(1, "Termin tarihi zorunludur"),
        kapsam_deadline_date: z
          .string()
          .min(1, "Kapsam termin tarihi zorunludur"),
        receiving_date: z.string().min(1, "Alım tarihi zorunludur"),
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
  const [productOpenStates, setProductOpenStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [newlyCreatedProduct, setNewlyCreatedProduct] =
    useState<Product | null>(null);

  const handleProductOpenChange = (index: number, isOpen: boolean) => {
    setProductOpenStates((prev) => ({ ...prev, [index]: isOpen }));
  };

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
      items: [
        {
          product: 0,
          ordered_quantity: 1,
          deadline_date: "",
          kapsam_deadline_date: "",
          receiving_date: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(values: FormValues) {
    try {
      const payload: CreateSalesOrderRequest = {
        order_number: values.order_number,
        customer: values.customer,
        status: values.status,
        items: values.items.map((item) => ({
          product: item.product,
          order_number: values.order_number,
          ordered_quantity: item.ordered_quantity,
          deadline_date: new Date(item.deadline_date).toISOString(),
          kapsam_deadline_date: new Date(
            item.kapsam_deadline_date
          ).toISOString(),
          receiving_date: new Date(item.receiving_date).toISOString(),
          fulfilled_quantity: 0,
        })),
      };

      await createSalesOrder(payload);
      toast.success("Satış siparişi başarıyla oluşturuldu");
      router.back();
    } catch (error) {
      toast.error("Satış siparişi oluşturulamadı");
    }
  }

  // Handler for when a new product is created
  const handleProductCreated = (product: Product) => {
    // Set the newly created product to use in the UI
    setNewlyCreatedProduct(product);

    // Find the currently active product field
    const activeFieldIndex = Object.keys(productOpenStates).find(
      (key) => productOpenStates[Number(key)] === true
    );

    if (activeFieldIndex) {
      // Set the value for this field - convert string to number for type safety
      // Add { shouldValidate: false } to prevent validation errors from showing
      form.setValue(
        `items.${Number(activeFieldIndex)}.product` as const,
        product.id,
        { shouldValidate: false }
      );

      // Close the product popover
      handleProductOpenChange(Number(activeFieldIndex), false);
    }
  };

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
                  <div className="flex flex-row gap-4 flex-wrap">
                    {/* Order Number */}
                    <div className="flex-1 min-w-[250px]">
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
                                className="bg-white w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Customer Select */}
                    <div className="flex-1 min-w-[300px]">
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

                    {/* Status Select */}
                    <div className="flex-1 min-w-[200px]">
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
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium ">Sipariş Kalemleri</h3>
                    <div className="flex gap-2">
                      <CreateProductDialog
                        triggerButtonLabel="Yeni Ürün"
                        defaultProductType="MONTAGED"
                        onProductCreated={handleProductCreated}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() =>
                          append({
                            product: 0,
                            ordered_quantity: 1,
                            deadline_date: "",
                            kapsam_deadline_date: "",
                            receiving_date: "",
                          })
                        }
                      >
                        <Plus className="h-4 w-4" />
                        Kalem Ekle
                      </Button>
                    </div>
                  </div>

                  <Table className="mb-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Ürün</TableHead>
                        <TableHead className="w-[100px]">Miktar</TableHead>
                        <TableHead className="w-[150px]">Alım Tarihi</TableHead>
                        <TableHead className="w-[150px]">
                          Termin Tarihi
                        </TableHead>
                        <TableHead className="w-[150px]">
                          Kapsam Tarihi
                        </TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.product`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Ürün</FormLabel>
                                  <Popover
                                    open={productOpenStates[index] || false}
                                    onOpenChange={(isOpen) =>
                                      handleProductOpenChange(index, isOpen)
                                    }
                                  >
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          disabled={isLoadingProducts}
                                          className={cn(
                                            "w-full justify-between bg-white",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ===
                                          newlyCreatedProduct?.id
                                            ? newlyCreatedProduct.product_name
                                            : products?.find(
                                                (product) =>
                                                  product.id ===
                                                  Number(field.value)
                                              )?.product_name || "Ürün seçin"}
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
                                            {filteredProducts?.map(
                                              (product) => (
                                                <CommandItem
                                                  value={`${product.product_name} (${product.product_code})`}
                                                  key={product.id}
                                                  onSelect={() => {
                                                    form.setValue(
                                                      `items.${index}.product`,
                                                      product.id
                                                    );
                                                    handleProductOpenChange(
                                                      index,
                                                      false
                                                    );
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
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.ordered_quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      {...field}
                                      className="bg-white"
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.receiving_date`}
                              render={({ field }) => (
                                <FormItem>
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
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.deadline_date`}
                              render={({ field }) => (
                                <FormItem>
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
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.kapsam_deadline_date`}
                              render={({ field }) => (
                                <FormItem>
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
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              disabled={fields.length === 1}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
