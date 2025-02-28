"use client";

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
import { toast } from "sonner";
import { useCreateProcessProduct } from "@/hooks/useProducts";
import { useProducts } from "@/hooks/useProducts";
import { Check, ChevronsUpDown, Plus, Pencil, X, Eye } from "lucide-react";
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
import { useState } from "react";
import { ProcessProduct } from "@/types/inventory";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const processProductFormSchema = z.object({
  product_code: z.string().min(1, "Ürün kodu gereklidir"),
  parent_product: z.number(),
  description: z.string().optional(),
  current_stock: z.number().default(0),
});

type ProcessProductFormValues = z.infer<typeof processProductFormSchema>;

interface ProcessProductFormProps {
  onClose: () => void;
}

export function ProcessProductForm({ onClose }: ProcessProductFormProps) {
  const { data: products = [], isLoading: isLoadingProducts } = useProducts({
    product_type: "SEMI",
  });
  const { mutateAsync: createProcessProduct, isPending: isCreating } =
    useCreateProcessProduct();
  const [openProduct, setOpenProduct] = useState(false);

  const form = useForm<ProcessProductFormValues>({
    resolver: zodResolver(processProductFormSchema),
    defaultValues: {
      product_code: "",
      parent_product: undefined,
      description: "",
      current_stock: 0,
    },
  });

  const handleSubmit = async (values: ProcessProductFormValues) => {
    try {
      const selectedProduct = products.find(
        (product) => product.id === values.parent_product
      );

      if (!selectedProduct) {
        toast.error("Seçilen ürün bulunamadı");
        return;
      }

      const processProductData: Partial<ProcessProduct> = {
        product_code: values.product_code,
        parent_product: values.parent_product,
        description: values.description,
        current_stock: values.current_stock,
      };

      await createProcessProduct(processProductData as ProcessProduct);
      toast.success("Proses ürünü başarıyla oluşturuldu");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Proses ürünü oluşturulurken bir hata oluştu");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="product_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ürün kodu</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Örn: PRD-001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parent_product"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ana ürün</FormLabel>
                <FormDescription>
                  Bu proses ürününün ait olduğu ana ürün
                </FormDescription>
                <div className="flex gap-2">
                  <Popover open={openProduct} onOpenChange={setOpenProduct}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openProduct}
                          className={cn(
                            "justify-between w-full",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoadingProducts}
                        >
                          {field.value
                            ? products.find(
                                (product) => product.id === field.value
                              )?.product_name || "Ürün Seçin"
                            : "Ürün Seçin"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Ürün ara..." />
                        <CommandEmpty>Ürün bulunamadı.</CommandEmpty>
                        <CommandList>
                          <CommandGroup heading="Ürünler">
                            {products.map((product) => (
                              <CommandItem
                                key={product.id}
                                value={product.product_name}
                                onSelect={() => {
                                  form.setValue("parent_product", product.id);
                                  setOpenProduct(false);
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
                                {product.product_name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="current_stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mevcut stok</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="Örn: 100"
                  />
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
                  <Input
                    {...field}
                    placeholder="Proses ürünü hakkında açıklama..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Oluşturuluyor..." : "Oluştur"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
