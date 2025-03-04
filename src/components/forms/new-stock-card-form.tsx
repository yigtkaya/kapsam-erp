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
import { useCreateProduct } from "@/hooks/useProducts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { InventoryCategoryName, Product, ProductType } from "@/types/inventory";

// export type InventoryCategoryName =
//   | "HAMMADDE"
//   | "PROSES"
//   | "MAMUL"
//   | "KARANTINA"
//   | "HURDA"
//   | "TAKIMHANE";

const formSchema = z.object({
  product_name: z.string().min(2, {
    message: "Ürün adı en az 2 karakter olmalıdır.",
  }),
  product_code: z.string().min(2, {
    message: "Ürün kodu en az 2 karakter olmalıdır.",
  }),
  multicode: z.string().optional(),
  project_name: z.string().optional(),
  product_type: z.enum(["SINGLE", "SEMI", "MONTAGED", "STANDARD_PART"], {
    required_error: "Lütfen ürün cinsini seçiniz.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Type for creating a new product (without id field)
type CreateProductInput = Omit<
  Product,
  "id" | "technical_drawings" | "inventory_category_display"
>;

export function NewStockCardForm() {
  const router = useRouter();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      product_code: "",
      multicode: "",
      project_name: "",
      product_type: undefined,
    },
  });

  function getInventoryCategoryIdFromProductType(
    productType: ProductType
  ): number {
    const categoryMap: Record<ProductType, number> = {
      SINGLE: 3,
      SEMI: 2,
      MONTAGED: 3,
      STANDARD_PART: 1,
    };
    return categoryMap[productType];
  }

  function onSubmit(values: FormValues) {
    // Get the inventory category based on product type
    const inventoryCategory = getInventoryCategoryIdFromProductType(
      values.product_type
    );

    // Create the product data with the correct type
    const productData: CreateProductInput = {
      ...values,
      current_stock: 0,
      multicode: values.multicode ? parseInt(values.multicode) : undefined,
      project_name: values.project_name || undefined,
      inventory_category: inventoryCategory,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
    };

    createProduct(productData as Product, {
      onSuccess: () => {
        toast.success("Stok kartı başarıyla oluşturuldu");
        router.back();
      },
      onError: (error) => {
        toast.error("Stok kartı oluşturulurken bir hata oluştu");
        console.error(error);
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="product_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ürün Adı</FormLabel>
                <FormControl>
                  <Input placeholder="Ürün adını giriniz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="product_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ürün Kodu</FormLabel>
                <FormControl>
                  <Input placeholder="Ürün kodunu giriniz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="multicode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Multikod</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Multikod giriniz"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proje Adı</FormLabel>
                <FormControl>
                  <Input placeholder="Proje adını giriniz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="product_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ürün Cinsi</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Ürün cinsini seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SINGLE">Tekli</SelectItem>
                    <SelectItem value="SEMI">Yarı Mamul</SelectItem>
                    <SelectItem value="MONTAGED">Montajlı</SelectItem>
                    <SelectItem value="STANDARD_PART">
                      Standart Parça
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Oluşturuluyor..." : "Oluştur"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
