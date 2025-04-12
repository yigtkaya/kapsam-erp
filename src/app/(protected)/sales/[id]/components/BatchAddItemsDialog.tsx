"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { PlusCircle, Trash2, Plus, Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from "@/hooks/useProducts";
import { useBatchCreateSalesOrderItems } from "../../hooks/useSalesOrderItems";
import { SalesOrderItem } from "@/types/sales";

const itemSchema = z.object({
  product: z.number().min(1, "Product is required"),
  ordered_quantity: z.number().min(1, "Quantity must be at least 1"),
  deadline_date: z.string().min(1, "Deadline date is required"),
  kapsam_deadline_date: z.string().optional(),
  receiving_date: z.string().optional(),
});

const formSchema = z.object({
  items: z.array(itemSchema).min(1, "At least one item is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface BatchAddItemsDialogProps {
  orderId: string;
  orderNumber: string;
}

export function BatchAddItemsDialog({
  orderId,
  orderNumber,
}: BatchAddItemsDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: products = [], isLoading: isProductsLoading } = useProducts();
  const { mutate: batchCreateItems, isPending } =
    useBatchCreateSalesOrderItems(orderId);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productOpenStates, setProductOpenStates] = useState<{
    [key: number]: boolean;
  }>({});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  const handleProductOpenChange = (index: number, isOpen: boolean) => {
    setProductOpenStates((prev) => ({ ...prev, [index]: isOpen }));
  };

  const filteredProducts = products?.filter((product) => {
    if (!productSearchQuery) return true;
    const search = productSearchQuery.toLowerCase().trim();
    return (
      product.product_name.toLowerCase().includes(search) ||
      product.product_code.toLowerCase().includes(search)
    );
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Add order_number to each item and ensure null values for optional fields
      const itemsWithOrderNumber = values.items.map((item) => ({
        product: item.product,
        ordered_quantity: item.ordered_quantity,
        deadline_date: item.deadline_date,
        kapsam_deadline_date: item.kapsam_deadline_date || null,
        receiving_date: item.receiving_date || null,
        order_number: orderNumber,
      })) as Array<
        Omit<
          SalesOrderItem,
          "id" | "product_details" | "order_id" | "fulfilled_quantity"
        >
      >;

      await batchCreateItems(itemsWithOrderNumber);
      toast.success("Kalemler başarıyla eklendi");
      form.reset({
        items: [
          {
            product: 0,
            ordered_quantity: 1,
            deadline_date: "",
            kapsam_deadline_date: "",
            receiving_date: "",
          },
        ],
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to add items:", error);
      toast.error("Kalemler eklenemedi");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="h-9 px-3 gap-2">
          <PlusCircle className="h-3.5 w-3.5" />
          Toplu Kalem Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Siparişe Toplu Kalem Ekle</DialogTitle>
          <DialogDescription>
            Siparişe birden fazla kalem eklemek için aşağıdaki formu doldurun.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mb-4"
                onClick={() =>
                  append({
                    product: 0,
                    ordered_quantity: 1,
                    deadline_date: "",
                    kapsam_deadline_date: "",
                    receiving_date: "",
                  })
                }
                disabled={isPending}
              >
                <Plus className="mr-2 h-4 w-4" />
                Yeni Kalem Ekle
              </Button>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Ürün</TableHead>
                    <TableHead className="w-[100px]">Miktar</TableHead>
                    <TableHead className="w-[150px]">Alım Tarihi</TableHead>
                    <TableHead className="w-[150px]">Termin Tarihi</TableHead>
                    <TableHead className="w-[150px]">Kapsam Tarihi</TableHead>
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
                              <Popover
                                open={productOpenStates[index]}
                                onOpenChange={(isOpen) =>
                                  handleProductOpenChange(index, isOpen)
                                }
                              >
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      disabled={isPending || isProductsLoading}
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
                                        Ürün bulunamadı
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
                                              handleProductOpenChange(
                                                index,
                                                false
                                              );
                                              setProductSearchQuery("");
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
                                  disabled={isPending}
                                  className="bg-white"
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
                                  disabled={isPending}
                                  className="bg-white"
                                  {...field}
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
                                  disabled={isPending}
                                  className="bg-white"
                                  {...field}
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
                                  disabled={isPending}
                                  className="bg-white"
                                  {...field}
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
                          disabled={isPending}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <DialogFooter className="gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                İptal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Ekleniyor..." : "Kalemleri Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
