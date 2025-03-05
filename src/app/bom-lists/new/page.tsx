"use client";

import { useCreateBOM } from "@/hooks/useBOMs";
import { useRouter } from "next/navigation";
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
import { PageHeader } from "@/components/ui/page-header";
import { useProducts } from "@/hooks/useProducts";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { CreateBOMRequest } from "@/types/manufacture";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
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
import { useState } from "react";

const formSchema = z.object({
  product: z.string().min(1, "Ürün seçilmesi zorunludur"),
  version: z.string().min(1, "Versiyon girilmesi zorunludur").default("1.0"),
  notes: z.string().optional(),
});

export default function NewBOMPage() {
  const router = useRouter();
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { mutate: createBOM, isPending } = useCreateBOM();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products?.filter((product) => {
    if (!searchQuery) return true;

    const search = searchQuery.toLowerCase().trim();
    return (
      product.product_name.toLowerCase().includes(search) ||
      product.product_code.toLowerCase().includes(search)
    );
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: "1.0",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const bomData: CreateBOMRequest = {
      product: values.product,
      version: values.version,
      is_active: true,
    };

    createBOM(bomData, {
      onSuccess: () => {
        toast.success("Ürün ağacı başarıyla oluşturuldu.");
        router.back();
      },
      onError: (error) => {
        toast.error("Ürün ağacı oluşturulurken bir hata oluştu.");
      },
    });
  }

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title="Yeni Ürün Ağacı"
        description="Yeni bir ürün ağacı oluşturun"
        showBackButton
        onBack={() => router.back()}
      />

      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ürün</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <ShadcnButton
                          variant="outline"
                          role="combobox"
                          disabled={isLoadingProducts}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? products?.find(
                                (product) =>
                                  product.id.toString() === field.value
                              )?.product_name
                            : "Ürün seçin"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </ShadcnButton>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandList className="max-h-[300px] overflow-y-auto">
                          <CommandInput
                            placeholder="Ürün ara..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandEmpty>Ürün bulunamadı.</CommandEmpty>
                          <CommandGroup>
                            {filteredProducts?.map((product) => (
                              <CommandItem
                                value={`${product.product_name} (${product.product_code})`}
                                key={product.id}
                                onSelect={() => {
                                  form.setValue(
                                    "product",
                                    product.product_code
                                  );
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
                                {product.product_name} ({product.product_code})
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
                  <FormLabel>Versiyon</FormLabel>
                  <FormControl>
                    <Input placeholder="Versiyon numarası" {...field} />
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
                    <Textarea
                      placeholder="Ürün ağacı ile ilgili notlar..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Oluştur
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
