"use client";

import { useCreateBOM } from "@/hooks/useBOMs";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Loader2, Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { BomRequest } from "@/types/manufacture";

const componentSchema = z.object({
  sequence_order: z.coerce.number().int().positive("Pozitif sayı olmalı"),
  product: z.number().min(1, "Ürün seçilmesi zorunludur"),
  quantity: z.string().min(1, "Miktar girilmesi zorunludur"),
  notes: z.string().optional(),
});

const formSchema = z.object({
  product: z.coerce.number().min(1, "Ürün seçilmesi zorunludur"),
  version: z.string().min(1, "Versiyon girilmesi zorunludur").default("1.0"),
  notes: z.string().optional(),
  components: z
    .array(componentSchema)
    .refine(
      (items) =>
        new Set(items.map((i) => i.sequence_order)).size === items.length,
      "Sıra numaraları benzersiz olmalıdır"
    ),
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
      components: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "components",
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const bomData: BomRequest = {
      product: values.product,
      version: values.version,
      is_active: true,
      components: values.components.map((comp) => ({
        bom: undefined,
        sequence_order: comp.sequence_order,
        quantity: comp.quantity,
        notes: comp.notes || null,
        product: comp.product,
      })),
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

      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
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
                                ? `${
                                    products?.find(
                                      (product) => product.id === field.value
                                    )?.product_name
                                  } (${
                                    products?.find(
                                      (product) => product.id === field.value
                                    )?.product_code
                                  })`
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
                                      form.setValue("product", product.id);
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        product.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {product.product_name} (
                                    {product.product_code})
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
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Versiyon</FormLabel>
                      <FormControl>
                        <Input placeholder="1.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notlar</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ürün ağacı ile ilgili notlar..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Bileşenler</h3>
                {fields.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      append({
                        sequence_order: fields.length + 1,
                        product: 0,
                        quantity: "1",
                        notes: "",
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Bileşen Ekle
                  </Button>
                )}
              </div>

              {fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                  <p className="mb-4 text-muted-foreground">
                    Henüz bileşen eklenmemiş
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      append({
                        sequence_order: 1,
                        product: 0,
                        quantity: "1",
                        notes: "",
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    İlk Bileşeni Ekle
                  </Button>
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-2">
                  {fields.map((field, index) => {
                    const selectedProduct = products?.find(
                      (p) => p.id === form.watch(`components.${index}.product`)
                    );

                    return (
                      <AccordionItem
                        key={field.id}
                        value={`item-${index}`}
                        className="border rounded-lg overflow-hidden bg-white shadow-sm"
                      >
                        <AccordionTrigger className="hover:no-underline [&>svg]:hidden">
                          <div className="flex items-center justify-between w-full p-2">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-50 text-blue-700 font-medium">
                                {form.watch(
                                  `components.${index}.sequence_order`
                                )}
                              </span>
                              <span className="text-muted-foreground">
                                {selectedProduct
                                  ? `${selectedProduct.product_name} (${selectedProduct.product_code})`
                                  : "Ürün Seçilmedi"}{" "}
                                | Miktar:{" "}
                                {form.watch(`components.${index}.quantity`)}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                remove(index);
                              }}
                              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-4 space-y-4 border-t">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="col-span-2">
                                <FormField
                                  control={form.control}
                                  name={`components.${index}.product`}
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                      <FormLabel>Ürün</FormLabel>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <FormControl>
                                            <ShadcnButton
                                              variant="outline"
                                              role="combobox"
                                              className={cn(
                                                "w-full justify-between",
                                                !field.value &&
                                                  "text-muted-foreground"
                                              )}
                                            >
                                              {field.value
                                                ? `${
                                                    products?.find(
                                                      (p) =>
                                                        p.id === field.value
                                                    )?.product_name
                                                  } (${
                                                    products?.find(
                                                      (p) =>
                                                        p.id === field.value
                                                    )?.product_code
                                                  })`
                                                : "Ürün seçin"}
                                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </ShadcnButton>
                                          </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                          <Command>
                                            <CommandInput placeholder="Ürün ara..." />
                                            <CommandList>
                                              <CommandEmpty>
                                                Ürün bulunamadı.
                                              </CommandEmpty>
                                              <CommandGroup>
                                                {products?.map((product) => (
                                                  <CommandItem
                                                    value={`${product.product_name} (${product.product_code})`}
                                                    key={product.id}
                                                    onSelect={() => {
                                                      form.setValue(
                                                        `components.${index}.product`,
                                                        product.id
                                                      );
                                                    }}
                                                  >
                                                    <Check
                                                      className={cn(
                                                        "mr-2 h-4 w-4",
                                                        product.id ===
                                                          field.value
                                                          ? "opacity-100"
                                                          : "opacity-0"
                                                      )}
                                                    />
                                                    {product.product_name} (
                                                    {product.product_code})
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
                              </div>
                              <FormField
                                control={form.control}
                                name={`components.${index}.sequence_order`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Sıra No</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="1"
                                        step="1"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`components.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Miktar</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`components.${index}.notes`}
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
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Oluştur
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
