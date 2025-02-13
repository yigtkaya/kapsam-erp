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
