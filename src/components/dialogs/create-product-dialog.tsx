"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { useState } from "react";
import { ProductType, Product } from "@/types/inventory";
import { Loader2, Plus } from "lucide-react";
import { ProductResponse } from "@/api/products";

// Define valid product types for form validation
const PRODUCT_TYPES = ["SINGLE", "SEMI", "MONTAGED", "STANDARD_PART"] as const;
type FormProductType = (typeof PRODUCT_TYPES)[number];

const formSchema = z.object({
  product_name: z.string().min(2, {
    message: "Ürün adı en az 2 karakter olmalıdır.",
  }),
  product_code: z.string().min(2, {
    message: "Ürün kodu en az 2 karakter olmalıdır.",
  }),
  multicode: z.string().optional(),
  project_name: z.string().optional(),
  product_type: z.enum(PRODUCT_TYPES, {
    required_error: "Lütfen ürün cinsini seçiniz.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProductDialogProps {
  onProductCreated?: (product: Product) => void;
  triggerButtonLabel?: string;
  defaultProductType?: FormProductType;
}

export function CreateProductDialog({
  onProductCreated,
  triggerButtonLabel = "Yeni Ürün Ekle",
  defaultProductType = "MONTAGED",
}: CreateProductDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createProduct, isPending } = useCreateProduct();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      product_code: "",
      multicode: "",
      project_name: "",
      product_type: defaultProductType,
    },
  });

  function getInventoryCategoryIdFromProductType(
    productType: FormProductType
  ): number {
    const categoryMap: Record<string, number> = {
      SINGLE: 3,
      SEMI: 2,
      MONTAGED: 3,
      STANDARD_PART: 1,
    };
    return categoryMap[productType] || 3; // Default to MAMUL (3) if not found
  }

  function onSubmit(values: FormValues) {
    // Get the inventory category based on product type
    const inventoryCategory = getInventoryCategoryIdFromProductType(
      values.product_type
    );

    // Create the product data
    const productData = {
      ...values,
      current_stock: 0,
      multicode: values.multicode ? parseInt(values.multicode) : undefined,
      project_name: values.project_name || undefined,
      inventory_category: inventoryCategory,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
    };

    createProduct(productData as Product, {
      onSuccess: (response: ProductResponse) => {
        toast.success("Stok kartı başarıyla oluşturuldu");
        setOpen(false);
        form.reset();

        // Call the callback with the created product if available
        if (onProductCreated && response.success && response.data) {
          onProductCreated(response.data);
        }
      },
      onError: (error) => {
        toast.error("Stok kartı oluşturulurken bir hata oluştu");
        console.error(error);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1.5">
          <Plus className="h-4 w-4" />
          {triggerButtonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yeni Stok Kartı Oluştur</DialogTitle>
          <DialogDescription>
            Sipariş için gerekli yeni ürün stok kartını hızlıca oluşturun.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <FormItem className="col-span-2">
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  "Oluştur"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
