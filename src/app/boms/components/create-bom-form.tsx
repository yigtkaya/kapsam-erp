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
import { createBOM } from "../actions";
import { useAllProducts } from "@/hooks/useProducts";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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

function BOMFormContent() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: products, isLoading } = useAllProducts();
  const form = useForm<CreateBomFormData>({
    resolver: zodResolver(createBomFormSchema),
    defaultValues: {
      product: "",
      version: "",
      is_active: true,
    },
  });

  async function onSubmit(data: CreateBomFormData) {
    try {
      const bomData = {
        ...data,
        components: [],
        created_at: new Date(),
        modified_at: new Date(),
      };

      await createBOM(bomData);
      toast.success("BOM created successfully");
      router.push("/boms");
      router.refresh();
    } catch (error) {
      toast.error("Failed to create BOM");
    }
  }

  if (isLoading) {
    return <BOMFormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Product</FormLabel>
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
                    >
                      {field.value
                        ? products?.find(
                            (product) => product.id.toString() === field.value
                          )?.product_name
                        : "Select product..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command className="max-h-[300px]">
                    <CommandInput placeholder="Search products..." />
                    <CommandEmpty>No product found.</CommandEmpty>
                    <CommandGroup>
                      {products && products.length > 0 ? (
                        products.map((product) => (
                          <CommandItem
                            value={product.product_name}
                            key={product.id}
                            onSelect={() => {
                              form.setValue("product", product.id.toString());
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                product.id.toString() === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {product.product_name}
                          </CommandItem>
                        ))
                      ) : (
                        <CommandItem disabled>
                          No products available
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the product this BOM is associated with
              </FormDescription>
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

        <Button type="submit">Create BOM</Button>
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
