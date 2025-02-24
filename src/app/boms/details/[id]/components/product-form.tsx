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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";
import { useCreateProductComponent } from "@/hooks/useProductComp";

const productFormSchema = z.object({
  product: z.number(),
  quantity: z.number().min(0),
  sequence_order: z.number().min(1),
  notes: z.string().optional(),
  bom: z.number(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  bomId: number;
  onClose: () => void;
}

export function ProductForm({ bomId, onClose }: ProductFormProps) {
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { mutateAsync: createComponent } = useCreateProductComponent();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      quantity: 0,
      sequence_order: 1,
      notes: "",
      bom: bomId,
    },
  });

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      toast.success("Mamül başarıyla eklendi");
      onClose();
    } catch (error) {
      toast.error("Mamül eklenirken bir hata oluştu");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mamül</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={isLoadingProducts}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Mamül Seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.product_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sequence_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sıra</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notlar</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit">Mamül Ekle</Button>
        </div>
      </form>
    </Form>
  );
}
