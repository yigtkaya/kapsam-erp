"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateBOM, useUpdateBOM } from "@/hooks/useBOMs";
import { BOMRequest, BOMResponse } from "@/types/manufacture";
import { useProducts } from "@/hooks/useProducts";

const formSchema = z.object({
  product: z.string().min(1, "Ürün seçimi gereklidir"),
  version: z.string().min(1, "Versiyon gereklidir"),
  is_active: z.boolean().default(true),
});

type BOMFormValues = z.infer<typeof formSchema>;

interface BOMFormProps {
  bom?: BOMResponse;
}

export function BOMForm({ bom }: BOMFormProps) {
  const router = useRouter();
  const { mutate: createBOM, isPending: isCreating } = useCreateBOM();
  const { mutate: updateBOM, isPending: isUpdating } = useUpdateBOM();
  const { data: products, isLoading: isLoadingProducts } = useProducts();

  const form = useForm<BOMFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: bom
      ? {
          product: bom.product.product_code,
          version: bom.version,
          is_active: bom.is_active,
        }
      : {
          product: "",
          version: "1.0",
          is_active: true,
        },
  });

  function onSubmit(values: BOMFormValues) {
    // Convert form values to the expected BOMRequest format
    const bomData: Omit<BOMRequest, "id"> = {
      product: values.product, // This should be the product code or ID as expected by the API
      version: values.version,
      is_active: values.is_active,
      created_at: bom?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (bom) {
      updateBOM(
        {
          id: bom.id,
          data: bomData,
        },
        {
          onSuccess: () => {
            toast.success("Reçete başarıyla güncellendi");
            router.back();
          },
          onError: (error: Error) => {
            toast.error(`Reçete güncellenirken hata oluştu: ${error.message}`);
            console.error("Update error details:", error);
          },
        }
      );
    } else {
      createBOM(bomData, {
        onSuccess: () => {
          toast.success("Reçete başarıyla oluşturuldu");
          router.push("/boms");
        },
        onError: (error: Error) => {
          toast.error(`Reçete oluşturulurken hata oluştu: ${error.message}`);
          console.error("Create error details:", error);
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ürün*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingProducts}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Ürün seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products?.map((product) => (
                      <SelectItem key={product.id} value={product.product_code}>
                        {product.product_code} - {product.product_name}
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
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Versiyon*</FormLabel>
                <FormControl>
                  <Input placeholder="Versiyon girin" {...field} />
                </FormControl>
                <FormDescription>Örneğin: 1.0, 2.1, vb.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Aktif</FormLabel>
                  <FormDescription>
                    Bu reçete aktif olarak kullanılacak mı?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/boms")}
          >
            İptal
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {bom ? "Güncelle" : "Oluştur"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
