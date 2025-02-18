"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/types/inventory";
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
import { toast } from "sonner";
import { useUpdateProduct, useProducts } from "@/hooks/useProducts";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { CommandList } from "cmdk";

// Define the Zod schema for Process Products, with product_type "PROCESS"
export const processProductSchema = z.object({
  product_code: z.string().nonempty("Ürün kodu zorunludur"),
  product_name: z.string().nonempty("Ürün adı zorunludur"),
  product_type: z.literal("SEMI"),
  description: z.string().optional(),
  inventory_category: z.number().optional(),
  current_stock: z.preprocess(
    (a) => Number(a),
    z.number().min(0, "Mevcut stok negatif olamaz")
  ),
});

type FormValues = z.infer<typeof processProductSchema>;

interface EditProcessProductFormProps {
  processProduct: Product;
}

export function EditProcessProductForm({
  processProduct,
}: EditProcessProductFormProps) {
  const router = useRouter();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { data: products, isLoading } = useProducts({ product_type: "SEMI" });
  const [openProductCode, setOpenProductCode] = useState(false);
  const [openProductName, setOpenProductName] = useState(false);

  const productsList = products?.results ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(processProductSchema),
    defaultValues: {
      product_code: processProduct.product_code,
      product_name: processProduct.product_name,
      description: processProduct.description || "",
      current_stock: processProduct.current_stock,
      product_type: "SEMI",
      inventory_category: processProduct.inventory_category,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const updatedProduct = await updateProduct({
        ...values,
        id: processProduct.id,
      } as unknown as Product);

      if (updatedProduct.success) {
        toast.success("Yarı Mamül ürün başarıyla güncellendi");
        router.back();
        router.refresh();
      } else {
        toast.error("Yarı Mamül ürün güncellenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Yarı Mamül ürün güncellenirken bir hata oluştu");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="product_code"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ürün Kodu</FormLabel>
              <Popover open={openProductCode} onOpenChange={setOpenProductCode}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProductCode}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      {field.value
                        ? productsList.find(
                            (product) => product.product_code === field.value
                          )?.product_code
                        : isLoading
                        ? "Yükleniyor..."
                        : "Ürün kodu seçin"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Ürün kodu ara..." />
                      <CommandEmpty>
                        {isLoading ? "Yükleniyor..." : "Ürün kodu bulunamadı."}
                      </CommandEmpty>
                      <CommandGroup>
                        {productsList.map((product) => (
                          <CommandItem
                            value={product.product_code}
                            key={product.id}
                            onSelect={() => {
                              form.setValue(
                                "product_code",
                                product.product_code
                              );
                              form.setValue(
                                "product_name",
                                product.product_name
                              );
                              setOpenProductCode(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                product.product_code === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {product.product_code}
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
          name="product_name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ürün Adı</FormLabel>
              <Popover open={openProductName} onOpenChange={setOpenProductName}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProductName}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      {field.value
                        ? productsList.find(
                            (product) => product.product_name === field.value
                          )?.product_name
                        : isLoading
                        ? "Yükleniyor..."
                        : "Ürün adı seçin"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Ürün adı ara..." />
                      <CommandEmpty>
                        {isLoading ? "Yükleniyor..." : "Ürün adı bulunamadı."}
                      </CommandEmpty>
                      <CommandGroup>
                        {productsList.map((product) => (
                          <CommandItem
                            value={product.product_name}
                            key={product.id}
                            onSelect={() => {
                              form.setValue(
                                "product_name",
                                product.product_name
                              );
                              form.setValue(
                                "product_code",
                                product.product_code
                              );
                              setOpenProductName(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                product.product_name === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {product.product_name}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
              <FormLabel>Stok Miktarı</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product_type"
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
          <Button type="submit">Kaydet</Button>
        </div>
      </form>
    </Form>
  );
}
