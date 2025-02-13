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

// Define the Zod schema for finished (montaged) products, with product_type "FINISHED_PRODUCT"
export const montagedProductSchema = z.object({
  product_code: z.string().nonempty("Ürün kodu zorunludur"),
  product_name: z.string().nonempty("Ürün adı zorunludur"),
  product_type: z.literal("MONTAGED"),
  description: z.string().optional(),
  inventory_category: z.number().optional(),
  current_stock: z.preprocess(
    (a) => Number(a),
    z.number().min(0, "Mevcut stok negatif olamaz")
  ),
});

type FormValues = z.infer<typeof montagedProductSchema>;

interface EditMontagedProductFormProps {
  montagedProduct: Product;
}

export function EditMontagedProductForm({
  montagedProduct,
}: EditMontagedProductFormProps) {
  const router = useRouter();
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const form = useForm<FormValues>({
    resolver: zodResolver(montagedProductSchema),
    defaultValues: {
      product_code: montagedProduct.product_code,
      product_name: montagedProduct.product_name,
      description: montagedProduct.description || "",
      current_stock: montagedProduct.current_stock,
      product_type: "MONTAGED",
      inventory_category: montagedProduct.inventory_category,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const updatedProduct = await updateProduct({
        ...values,
        id: montagedProduct.id,
      } as unknown as Product);

      if (updatedProduct.success) {
        toast.success("Montaged ürün başarıyla güncellendi");
        router.back();
        router.refresh();
      } else {
        toast.error("Montaged ürün güncellenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Montaged ürün güncellenirken bir hata oluştu");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="product_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ürün Kodu</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
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
