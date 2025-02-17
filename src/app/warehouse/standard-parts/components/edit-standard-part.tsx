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
import { useUpdateProduct } from "@/hooks/useProducts";
import { useProducts } from "@/hooks/useProducts";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/api/utils";
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
import { useState } from "react";

// Define the Zod schema for Standard Parts (Product with type STANDARD_PART)
export const standardPartSchema = z.object({
  product_code: z.string().nonempty("Parça kodu zorunludur"),
  product_name: z.string().nonempty("Parça adı zorunludur"),
  product_type: z.literal("STANDARD_PART"),
  description: z.string().optional(),
  current_stock: z.preprocess(
    (a) => Number(a),
    z.number().min(0, "Mevcut stok negatif olamaz")
  ),
});

type FormValues = z.infer<typeof standardPartSchema>;

interface EditStandardPartFormProps {
  part: Product;
}

export function EditStandardPartForm({ part }: EditStandardPartFormProps) {
  const router = useRouter();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { data: products, isLoading } = useProducts({
    product_type: "STANDARD_PART",
  });
  const productsList = products?.results ?? [];
  const [openProductCode, setOpenProductCode] = useState(false);
  const [openProductName, setOpenProductName] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(standardPartSchema),
    defaultValues: {
      product_code: part.product_code,
      product_name: part.product_name,
      description: part.description || "",
      current_stock: part.current_stock,
      product_type: "STANDARD_PART",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Merge the existing product details with the form values
      const updatedProduct = await updateProduct({
        ...values,
        id: part.id,
      } as unknown as Product);

      if (updatedProduct.success) {
        toast.success("Standart parça başarıyla güncellendi");
        router.back();
        router.refresh();
      } else {
        toast.error("Standart parça güncellenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Standart parça güncellenirken bir hata oluştu");
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
                        : "Ürün kodu seçin"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Ürün kodu ara..." />
                      <CommandEmpty>Ürün kodu bulunamadı</CommandEmpty>
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
                    >
                      {field.value
                        ? productsList.find(
                            (product) => product.product_name === field.value
                          )?.product_name
                        : "Ürün adı seçiniz"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="Ürün adı ara..." />
                    <CommandList>
                      <CommandEmpty>Ürün bulunamadı</CommandEmpty>
                      <CommandGroup>
                        {productsList.map((product) => (
                          <CommandItem
                            key={product.id}
                            value={product.product_name}
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
                            {product.product_name}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                product.product_name === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
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
