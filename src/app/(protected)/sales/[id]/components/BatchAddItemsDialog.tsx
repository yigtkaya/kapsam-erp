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
  product: z.number().min(1, "Ürün zorunludur"),
  ordered_quantity: z.number().min(1, "Miktar en az 1 olmalıdır"),
  deadline_date: z.string().min(1, "Termin tarihi zorunludur"),
  kapsam_deadline_date: z.string().optional(),
  receiving_date: z.string().optional(),
});

const formSchema = z.object({
  items: z.array(itemSchema).min(1, "En az bir kalem gereklidir"),
});

type FormValues = z.infer<typeof formSchema>;

interface BatchAddItemsDialogProps {
  orderId: string;
  orderNumber: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BatchAddItemsDialog({
  orderId,
  orderNumber,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: BatchAddItemsDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use either controlled (external) state or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

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
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">
            Siparişe Toplu Kalem Ekle
          </DialogTitle>
          <DialogDescription className="mt-2 text-base">
            Siparişe birden fazla kalem eklemek için aşağıdaki formu doldurun.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Sipariş Kalemleri</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
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
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Yeni Kalem Ekle
                </Button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-medium text-gray-600">
                        Ürün
                      </TableHead>
                      <TableHead className="font-medium text-gray-600 w-[100px]">
                        Miktar
                      </TableHead>
                      <TableHead className="font-medium text-gray-600 w-[150px]">
                        Alım Tarihi
                      </TableHead>
                      <TableHead className="font-medium text-gray-600 w-[150px]">
                        Termin Tarihi
                      </TableHead>
                      <TableHead className="font-medium text-gray-600 w-[150px]">
                        Kapsam Tarihi
                      </TableHead>
                      <TableHead className="font-medium text-gray-600 w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id} className="hover:bg-gray-50">
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
                                        disabled={
                                          isPending || isProductsLoading
                                        }
                                        className={cn(
                                          "w-full justify-between bg-white",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value
                                          ? products?.find(
                                              (product) =>
                                                product.id ===
                                                Number(field.value)
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
                                              className="flex items-center gap-2"
                                            >
                                              <Check
                                                className={cn(
                                                  "h-4 w-4",
                                                  product.id ===
                                                    Number(field.value)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
                                              <div>
                                                <div>
                                                  {product.product_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                  {product.product_code}
                                                </div>
                                              </div>
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
                                    className="bg-white h-9"
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
                                    className="bg-white h-9"
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
                                    className="bg-white h-9"
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
                                    className="bg-white h-9"
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
                            disabled={isPending || fields.length <= 1}
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
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isPending ? "Ekleniyor..." : "Kalemleri Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
