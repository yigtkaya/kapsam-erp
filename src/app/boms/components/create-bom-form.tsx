"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/inventory";
import { createBOM } from "@/api/boms";

const createBomFormSchema = z.object({
  product: z.string().min(1, "Product is required"),
  version: z.string().min(1, "Version is required"),
  is_active: z.boolean().default(true),
});

type CreateBomFormData = z.infer<typeof createBomFormSchema>;

function BOMFormSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <Skeleton className="h-10 w-[100px]" />
    </div>
  );
}

interface BOMFormContentProps {
  products: Product[];
}

function BOMFormContent() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: products = [], isLoading, error } = useProducts({});
  const form = useForm<CreateBomFormData>({
    resolver: zodResolver(createBomFormSchema),
    defaultValues: {
      product: "",
      version: "",
      is_active: true,
    },
  });

  if (!products) {
    return <BOMFormSkeleton />;
  }

  if (products.length === 0) {
    return <div>Ürün bulunamadı</div>;
  }

  async function onSubmit(data: CreateBomFormData) {
    try {
      const selectedProduct = products.find(
        (p) => p.product_code === data.product
      );
      if (!selectedProduct) {
        throw new Error("Seçilen ürün bulunamadı");
      }

      const bomData = {
        ...data,
        components: [],
        created_at: new Date(),
        modified_at: new Date(),
        product_type: selectedProduct.product_type,
      };

      await createBOM(bomData);
      toast.success("Reçete başarıyla oluşturuldu");
      router.push("/boms");
      router.refresh();
    } catch (error) {
      console.error("Error creating BOM:", error);
      toast.error("Reçete oluşturulurken sorun çıktı");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ürün Kodu</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      {field.value
                        ? products.find(
                            (product: Product) =>
                              product.product_code === field.value
                          )?.product_code
                        : isLoading
                        ? "Yükleniyor..."
                        : "Ürün kodu seçin"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandList className="max-h-[300px] overflow-auto">
                      <CommandInput placeholder="Ürün kodu ara..." />
                      <CommandEmpty>
                        {isLoading ? "Yükleniyor..." : "Ürün kodu bulunamadı."}
                      </CommandEmpty>
                      <CommandGroup>
                        {products.map((product: Product) => (
                          <CommandItem
                            value={product.product_code}
                            key={product.id}
                            onSelect={() => {
                              form.setValue("product", product.product_code);
                              setOpen(false);
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
                            {product.product_code}
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

        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version</FormLabel>
              <FormControl>
                <Input placeholder="Enter BOM version" {...field} />
              </FormControl>
              <FormDescription>
                Version number or identifier for this BOM
              </FormDescription>
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
                <FormLabel className="text-base">Aktiflik Durumu</FormLabel>
                <FormDescription>
                  Bu reçetenin aktif olup olmadığı
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

        <Button className="w-full" type="submit">
          Reçete Oluştur
        </Button>
      </form>
    </Form>
  );
}

export function CreateBOMForm() {
  return (
    <Suspense fallback={<BOMFormSkeleton />}>
      <BOMFormContent />
    </Suspense>
  );
}
