"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BOM } from "@/types/manufacture";
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
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateBOM } from "@/api/boms";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/inventory";
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
import { useBOM } from "@/hooks/useBOMs";

const editBomFormSchema = z.object({
  product: z.string().min(1, "Product is required"),
  version: z.string().min(1, "Version is required"),
  is_active: z.boolean().default(true),
});

type EditBomFormData = z.infer<typeof editBomFormSchema>;

interface EditBOMFormProps {
  initialData: BOM;
}

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

function EditBOMFormContent({ initialData }: EditBOMFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: products, isLoading } = useProducts({});

  const form = useForm<EditBomFormData>({
    resolver: zodResolver(editBomFormSchema),
    defaultValues: {
      product: initialData.product || "",
      version: initialData.version || "",
      is_active: initialData.is_active ?? true,
    },
  });

  async function onSubmit(data: EditBomFormData) {
    try {
      const bomData = {
        ...data,
        components: initialData.components || [],
        modified_at: new Date(),
      };

      await updateBOM(initialData.id, bomData);
      toast.success("BOM updated successfully");
      router.push("/boms");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update BOM");
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!products) {
    return <div>No</div>;
  }

  if (products.length === 0) {
    return <div>No products found</div>;
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
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Whether this BOM is currently active
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

        <Button type="submit">Update BOM</Button>
      </form>
    </Form>
  );
}

export function EditBOMForm() {
  const params = useParams();
  const { data: bom, isLoading } = useBOM(Number(params.id));
  if (!bom) {
    return <div>BOM not found</div>;
  }

  return (
    <Suspense fallback={<BOMFormSkeleton />}>
      <EditBOMFormContent initialData={bom} />
    </Suspense>
  );
}
