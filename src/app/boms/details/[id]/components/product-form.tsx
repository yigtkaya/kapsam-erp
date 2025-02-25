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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductComponent, ProductType } from "@/types/manufacture";
import { toast } from "sonner";
import { useCreateProductComponent } from "@/hooks/useProductComp";
import { useProducts } from "@/hooks/useProducts";
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
import { useState } from "react";

const productFormSchema = z.object({
  product: z.string().min(1, "Ürün seçimi gereklidir"),
  sequence_order: z.number().min(1, "Sıra numarası gereklidir"),
  quantity: z.number().min(1, "Miktar en az 1 olmalıdır"),
  notes: z.string().optional(),
  bom: z.number(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  bomId: number;
  onClose: () => void;
}

export function ProductForm({ bomId, onClose }: ProductFormProps) {
  const { data: products = [], isLoading: isLoadingProducts } = useProducts({});
  const { mutateAsync: createComponent, isPending: isCreating } = useCreateProductComponent();
  const [openProductSelect, setOpenProductSelect] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      sequence_order: 1,
      quantity: 1,
      notes: "",
      bom: bomId,
    },
  });

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const selectedProduct = products.find(
        (product) => product.product_code === values.product
      );

      if (!selectedProduct) {
        toast.error("Seçilen ürün bulunamadı");
        return;
      }

      const componentData = {
        ...values,
        component_type: "PRODUCT" as const,
        details: {
          type: "PRODUCT" as const,
          product: {
            id: selectedProduct.id,
            product_code: selectedProduct.product_code,
            name: selectedProduct.product_name,
            product_type: selectedProduct.product_type as ProductType,
          },
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await createComponent(componentData as unknown as Omit<ProductComponent, "id">);
      toast.success("Ürün başarıyla eklendi");
      onClose();
    } catch (error) {
      toast.error("Ürün eklenirken bir hata oluştu");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ürün</FormLabel>
              <Popover open={openProductSelect} onOpenChange={setOpenProductSelect}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProductSelect}
                      className={cn(
                        "justify-between w-full",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoadingProducts}
                    >
                      {field.value
                        ? products.find(
                          (product) => product.product_code === field.value
                        )?.product_name || "Ürün Seçin"
                        : "Ürün Seçin"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-[240px]" align="start" sideOffset={4}>
                  <Command className="max-h-[300px]">
                    <CommandInput placeholder="Ürün ara..." />
                    <CommandEmpty>Ürün bulunamadı.</CommandEmpty>
                    <CommandList className="max-h-[250px] overflow-y-auto">
                      <CommandGroup heading="Ürünler">
                        {products.map((product) => (
                          <CommandItem
                            key={product.id}
                            value={product.product_name}
                            onSelect={() => {
                              form.setValue("product", product.product_code);
                              setOpenProductSelect(false);
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
                            <div className="flex flex-col">
                              <span>{product.product_name}</span>
                              <span className="text-xs text-muted-foreground">
                                {product.product_code} - {product.product_type}
                              </span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sequence_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sıra Numarası</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Örn: 1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miktar</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Örn: 1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notlar</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ürün hakkında notlar..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" disabled={isCreating} className="bg-blue-600 hover:bg-blue-700">
            {isCreating ? "Ekleniyor..." : "Ürünü Ekle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
