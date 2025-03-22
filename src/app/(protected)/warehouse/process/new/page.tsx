"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ProcessProductFormData, processProductSchema } from "./form";
import { useCreateProduct } from "@/hooks/useProducts";
import { Product } from "@/types/inventory";

export default function NewProcessProductPage() {
  const router = useRouter();
  const { mutateAsync: createProduct } = useCreateProduct();

  const form = useForm<ProcessProductFormData>({
    resolver: zodResolver(processProductSchema),
    defaultValues: {
      product_code: "",
      product_name: "",
      product_type: "SEMI",
      description: "",
      current_stock: 0,
      inventory_category: 2,
    },
  });

  const onSubmit = async (data: ProcessProductFormData) => {
    try {
      const response = await createProduct(data as unknown as Product);
      if (response.success) {
        toast.success("Yarı Mamül ürün başarıyla oluşturuldu");
        router.back();
        return;
      } else {
        const error = await response.data;
        toast.error("Ürün oluşturulamadı", {
          description: error,
        });
      }
    } catch (error) {
      toast.error("Form gönderilirken hata oluştu", {
        description:
          error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
      });
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Yeni Yarı Mamül Ürün Ekle</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium mb-2">Temel Bilgiler</h3>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="product_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ürün Kodu</FormLabel>
                    <FormControl>
                      <Input placeholder="Ürün kodunu girin" {...field} />
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
                      <Input placeholder="Ürün adını girin" {...field} />
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
              <FormItem>
                <FormLabel>Ürün Tipi</FormLabel>
                <div className="flex items-center h-10">
                  <Badge variant="secondary">Yarı Mamül Ürün</Badge>
                </div>
                <FormDescription>
                  Bu alan otomatik olarak atanır ve değiştirilemez
                </FormDescription>
              </FormItem>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium mb-2">Açıklama</h3>
            <Separator className="mb-4" />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ürün hakkında açıklama girin"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Oluşturuluyor..." : "Ürünü Oluştur"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
