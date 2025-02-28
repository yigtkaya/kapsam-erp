"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProcessProductFormData,
  processProductSchema,
} from "@/app/warehouse/process/new/form";
import { useCreateProcessProduct, useProducts } from "@/hooks/useProducts";
import { ProcessProduct, Product } from "@/types/inventory";
import { toast } from "sonner";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface ProcessProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessProductDialog({
  open,
  onOpenChange,
}: ProcessProductDialogProps) {
  const { mutateAsync: createProcessProduct } = useCreateProcessProduct();
  const [openParentProduct, setOpenParentProduct] = useState(false);
  const { data: products = [], isLoading: isLoadingProducts } = useProducts({
    product_type: "SEMI",
  });

  const form = useForm<ProcessProductFormData>({
    resolver: zodResolver(processProductSchema),
    defaultValues: {
      product_code: "",
      product_name: "",
      product_type: "SEMI",
      description: "",
      current_stock: 0,
      inventory_category: 2,
      parent_product: undefined,
    },
  });

  const onSubmit = async (data: ProcessProductFormData) => {
    try {
      if (!data.parent_product) {
        toast.error("Ana ürün seçilmesi zorunludur");
        return;
      }

      const processProductData: Partial<ProcessProduct> = {
        parent_product: data.parent_product,
        product_code: data.product_code,
        description: data.description,
        current_stock: data.current_stock,
      };

      const response = await createProcessProduct(
        processProductData as ProcessProduct
      );

      if (response) {
        toast.success("Yarı Mamül ürün başarıyla oluşturuldu");
        onOpenChange(false);
        form.reset();
      }
    } catch (error) {
      toast.error("Form gönderilirken hata oluştu", {
        description:
          error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Proses Ürünü Oluştur</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="parent_product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ana Ürün</FormLabel>
                  <div className="flex gap-2">
                    <Popover
                      open={openParentProduct}
                      onOpenChange={setOpenParentProduct}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openParentProduct}
                            className={cn(
                              "justify-between w-full",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isLoadingProducts}
                          >
                            {isLoadingProducts
                              ? "Yükleniyor..."
                              : field.value
                              ? products.find(
                                  (product) => product.id === field.value
                                )?.product_name || "Ana Ürün Seçin"
                              : "Ana Ürün Seçin"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[--radix-popover-trigger-width] p-0"
                        align="start"
                        sideOffset={4}
                      >
                        <Command className="w-full">
                          <CommandInput
                            placeholder="Ana ürün ara..."
                            className="h-9"
                          />
                          <CommandEmpty>
                            {isLoadingProducts
                              ? "Yükleniyor..."
                              : "Ana ürün bulunamadı."}
                          </CommandEmpty>
                          <CommandList className="max-h-[200px] overflow-y-auto">
                            <CommandGroup heading="Ana Ürünler">
                              {products.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  value={`${product.product_name} ${product.product_code}`}
                                  onSelect={() => {
                                    form.setValue("parent_product", product.id);
                                    setOpenParentProduct(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      product.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {product.product_name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {product.product_code}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormDescription>
                    Bu proses ürününün bağlı olacağı ana ürünü seçin
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="product_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ürün Kodu</FormLabel>
                  <FormControl>
                    <Input placeholder="Ürün kodu..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ürün Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Ürün adı..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Input placeholder="Açıklama..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mevcut Stok</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Oluştur
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
