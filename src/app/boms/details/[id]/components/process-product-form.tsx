"use client";

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const processProductSchema = z.object({
  parent_product: z.number(),
  description: z.string().optional(),
  current_stock: z.number().default(0),
});

type ProcessProductFormValues = z.infer<typeof processProductSchema>;

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
    resolver: zodResolver(processProductSchema),
    defaultValues: {
      parent_product: undefined,
      description: "",
      current_stock: 0,
    },
  });

  const filteredProducts = products.filter(
    (product) =>
      product.product_type === "SEMI" || product.product_type === "SINGLE"
  );

  const handleSubmit = async (values: ProcessProductFormValues) => {
    try {
      const selectedProduct = filteredProducts.find(
        (product) => product.id === values.parent_product
      );

      if (!selectedProduct) {
        toast.error("Seçilen ürün bulunamadı");
        return;
      }

      const processProductData: Partial<ProcessProduct> = {
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
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="parent_product"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Parent product:</FormLabel>
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
                              ? filteredProducts.find(
                                  (product) => product.id === field.value
                                )?.product_name || "---------"
                              : "---------"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Search product..." />
                          <CommandEmpty>No product found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup heading="Products">
                              {filteredProducts.map((product) => (
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
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {product.product_name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {product.product_code} (
                                      {product.product_type})
                                    </span>
                                  </div>
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
                  <FormDescription>
                    The parent product (SEMI or SINGLE) this process product
                    belongs to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description:</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter description..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="current_stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current stock:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

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
