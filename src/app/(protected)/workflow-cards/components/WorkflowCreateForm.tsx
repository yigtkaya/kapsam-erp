"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { createWorkflowWithConfigs } from "../api/workflows";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { AxisCount } from "@/types/manufacture";
import { useProcesses } from "@/hooks/useManufacturing";
import { useTools } from "@/hooks/use-tools";
import { useFixtures } from "@/hooks/useFixture";
import { useGauges } from "@/hooks/useGauges";
import { useState } from "react";

export function WorkflowCreateForm() {
  const router = useRouter();
  const { data: products } = useProducts();
  const { data: processes } = useProcesses();
  const { data: tools } = useTools();
  const { data: fixtures } = useFixtures();
  const { data: controlGauges } = useGauges();

  const processConfigSchema = z
    .object({
      process: z.coerce
        .number()
        .refine(
          (val) => processes?.some((p) => p.id === val),
          "Geçersiz operasyon ID'si"
        ),
      version: z.string().min(1, "Versiyon zorunlu"),
      status: z.string().min(1, "Durum zorunlu"),
      sequence_order: z.coerce.number().int().positive("Pozitif sayı olmalı"),
      stock_code: z.string().optional().default(""),
      tool: z.string().optional(),
      control_gauge: z.string().optional(),
      fixture: z.string().optional(),
      axis_count: z.enum(Object.values(AxisCount) as [string, ...string[]]),
      machine_time: z.coerce.number().int().positive("Pozitif tam sayı olmalı"),
      setup_time: z.coerce.number().int().positive("Pozitif tam sayı olmalı"),
      net_time: z.coerce.number().int().positive("Pozitif tam sayı olmalı"),
      number_of_bindings: z.coerce
        .number()
        .int()
        .positive("Pozitif tam sayı olmalı"),
      description: z.string().optional().default(""),
    })
    .refine((data) => data.tool || data.control_gauge || data.fixture, {
      message: "Takım, mastar veya fikstürden en az biri gereklidir",
      path: ["tool"],
    });

  const formSchema = z.object({
    product: z.coerce
      .number()
      .refine(
        (val) => products?.some((p) => p.id === val),
        "Geçersiz ürün ID'si"
      ),
    version: z.string().min(1, "Versiyon zorunlu"),
    status: z.string().min(1, "Durum zorunlu"),
    notes: z.string().optional().default(""),
    process_configs: z
      .array(processConfigSchema)
      .refine(
        (items) =>
          new Set(items.map((i) => i.sequence_order)).size === items.length,
        "Sıra numaraları benzersiz olmalıdır"
      ),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: undefined,
      version: "1.0",
      status: "DRAFT",
      notes: "",
      process_configs: [
        {
          process: 1,
          version: "1.0",
          status: "DRAFT",
          sequence_order: 1,
          stock_code: "",
          tool: "",
          control_gauge: "",
          fixture: "",
          axis_count: "3EKSEN",
          machine_time: 0,
          setup_time: 0,
          net_time: 0,
          number_of_bindings: 1,
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "process_configs",
    control: form.control,
  });

  const [openProduct, setOpenProduct] = useState(false);
  const [openProcess, setOpenProcess] = useState<number | null>(null);

  async function onSubmit(data: FormValues) {
    try {
      await createWorkflowWithConfigs(data);
      toast.success("İş akışı başarıyla oluşturuldu");
      router.push("/workflow-cards");
    } catch (error) {
      toast.error("İş akışı oluşturulurken bir hata oluştu");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormLabel>Ürün</FormLabel>
                  <Popover open={openProduct} onOpenChange={setOpenProduct}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full h-[40px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={!products || products.length === 0}
                        >
                          {field.value
                            ? products?.find((p) => p.id === field.value)
                                ?.product_code
                            : "Ürün seçin"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Ürün ara..."
                          className="h-9"
                        />
                        <CommandEmpty>Ürün bulunamadı</CommandEmpty>
                        <CommandList>
                          <CommandGroup className="max-h-64 overflow-y-auto">
                            {products?.map((product) => (
                              <CommandItem
                                value={product.id.toString()}
                                key={product.id}
                                onSelect={() => {
                                  form.setValue("product", product.id);
                                  setOpenProduct(false);
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{product.product_code}</span>
                                  <span>{product.product_name}</span>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    product.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.product && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.product.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormLabel>Versiyon</FormLabel>
                  <FormControl>
                    <Input placeholder="1.0" {...field} className="h-[40px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durum</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DRAFT">Taslak</SelectItem>
                  <SelectItem value="ACTIVE">Aktif</SelectItem>
                  <SelectItem value="INACTIVE">Pasif</SelectItem>
                </SelectContent>
              </Select>
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
                  placeholder="İş akışı ile ilgili notlar..."
                  className="h-10 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Süreç Konfigürasyonları</h3>
            {fields.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  append({
                    process: fields.length + 1,
                    version: "1.0",
                    status: "DRAFT",
                    sequence_order: fields.length + 1,
                    stock_code: "",
                    tool: "",
                    control_gauge: "",
                    fixture: "",
                    axis_count: "3EKSEN",
                    machine_time: 0,
                    setup_time: 0,
                    net_time: 0,
                    number_of_bindings: 1,
                    description: "",
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Süreç Ekle
              </Button>
            )}
          </div>

          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
              <p className="mb-4 text-muted-foreground">
                Henüz süreç eklenmemiş
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  append({
                    process: 1,
                    version: "1.0",
                    status: "DRAFT",
                    sequence_order: 1,
                    stock_code: "",
                    tool: "",
                    control_gauge: "",
                    fixture: "",
                    axis_count: "3EKSEN",
                    machine_time: 0,
                    setup_time: 0,
                    net_time: 0,
                    number_of_bindings: 1,
                    description: "",
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                İlk Süreci Ekle
              </Button>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-2">
              {fields.map((field, index) => {
                const stockCode = form.watch(
                  `process_configs.${index}.stock_code`
                );
                const sequenceOrder = form.watch(
                  `process_configs.${index}.sequence_order`
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
                            {sequenceOrder}
                          </span>
                          <span className="text-muted-foreground">
                            {processes?.find(
                              (p) =>
                                p.id ===
                                form.watch(`process_configs.${index}.process`)
                            )?.process_code || "Operasyon Yok"}{" "}
                            -{" "}
                            {processes?.find(
                              (p) =>
                                p.id ===
                                form.watch(`process_configs.${index}.process`)
                            )?.process_name || ""}{" "}
                            | Stok: {stockCode || "Yok"} | Eksen:{" "}
                            {form
                              .watch(`process_configs.${index}.axis_count`)
                              .replace("EKSEN", " Eksen")
                              .replace("POINT_FIVE", ".5")}
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
                          <div className="flex flex-col space-y-2">
                            <FormField
                              control={form.control}
                              name={`process_configs.${index}.process`}
                              render={({ field }) => (
                                <FormItem className="h-full">
                                  <FormLabel>Operasyon</FormLabel>
                                  <Popover
                                    open={openProcess === index}
                                    onOpenChange={(open) =>
                                      setOpenProcess(open ? index : null)
                                    }
                                  >
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          className={cn(
                                            "w-full justify-between h-[40px]",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                        >
                                          {field.value
                                            ? processes?.find(
                                                (p) =>
                                                  p.id.toString() ===
                                                  field.value.toString()
                                              )?.process_code
                                            : "Süreç seçin"}
                                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0">
                                      <Command shouldFilter={false}>
                                        <CommandInput
                                          placeholder="Süreç ara..."
                                          className="h-9"
                                        />
                                        <CommandEmpty>
                                          Süreç bulunamadı
                                        </CommandEmpty>
                                        <CommandList>
                                          <CommandGroup className="max-h-64 overflow-y-auto">
                                            {processes?.map((process) => (
                                              <CommandItem
                                                value={process.process_code}
                                                key={process.id}
                                                onSelect={() => {
                                                  form.setValue(
                                                    `process_configs.${index}.process`,
                                                    process.id
                                                  );
                                                  setOpenProcess(null);
                                                }}
                                              >
                                                {process.process_code} -{" "}
                                                {process.process_name}
                                                <Check
                                                  className={cn(
                                                    "ml-auto h-4 w-4",
                                                    process.id === field.value
                                                      ? "opacity-100"
                                                      : "opacity-0"
                                                  )}
                                                />
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

                          <div className="flex flex-col space-y-2">
                            <FormField
                              control={form.control}
                              name={`process_configs.${index}.stock_code`}
                              render={({ field }) => (
                                <FormItem className="h-full">
                                  <FormLabel>Stok Kodu</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="h-[40px]" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <FormField
                              control={form.control}
                              name={`process_configs.${index}.sequence_order`}
                              render={({ field }) => (
                                <FormItem className="h-full">
                                  <FormLabel>Sıra No</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      step="1"
                                      placeholder="Sıra numarası girin"
                                      className="h-[40px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`process_configs.${index}.tool`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Takım</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-full justify-between h-[40px]",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value
                                          ? tools?.find(
                                              (t) =>
                                                t.stock_code === field.value
                                            )?.stock_code
                                          : "Takım seçin"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command shouldFilter={false}>
                                      <CommandInput
                                        placeholder="Takım ara..."
                                        className="h-9"
                                      />
                                      <CommandEmpty>
                                        Takım bulunamadı
                                      </CommandEmpty>
                                      <CommandList>
                                        <CommandGroup className="max-h-64 overflow-y-auto">
                                          {tools?.map((tool) => (
                                            <CommandItem
                                              value={tool.stock_code}
                                              key={tool.stock_code}
                                              onSelect={() => {
                                                form.setValue(
                                                  `process_configs.${index}.tool`,
                                                  tool.stock_code
                                                );
                                              }}
                                            >
                                              {tool.stock_code} -{" "}
                                              {tool.tool_type}
                                              <Check
                                                className={cn(
                                                  "ml-auto h-4 w-4",
                                                  tool.stock_code ===
                                                    field.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
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
                            name={`process_configs.${index}.control_gauge`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Kontrol Mastarı</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-full justify-between h-[40px]",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value
                                          ? controlGauges?.find(
                                              (g) =>
                                                g.stock_code === field.value
                                            )?.stock_code
                                          : "Mastar seçin"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command shouldFilter={false}>
                                      <CommandInput
                                        placeholder="Mastar ara..."
                                        className="h-9"
                                      />
                                      <CommandEmpty>
                                        Mastar bulunamadı
                                      </CommandEmpty>
                                      <CommandList>
                                        <CommandGroup className="max-h-64 overflow-y-auto">
                                          {controlGauges?.map((gauge) => (
                                            <CommandItem
                                              value={gauge.stock_code}
                                              key={gauge.stock_code}
                                              onSelect={() => {
                                                form.setValue(
                                                  `process_configs.${index}.control_gauge`,
                                                  gauge.stock_code
                                                );
                                              }}
                                            >
                                              {gauge.stock_code} -{" "}
                                              {gauge.stock_name}
                                              <Check
                                                className={cn(
                                                  "ml-auto h-4 w-4",
                                                  gauge.stock_code ===
                                                    field.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
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
                            name={`process_configs.${index}.fixture`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Fikstür</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-full justify-between h-[40px]",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value
                                          ? fixtures?.find(
                                              (f) => f.code === field.value
                                            )?.code
                                          : "Fikstür seçin"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command shouldFilter={false}>
                                      <CommandInput
                                        placeholder="Fikstür ara..."
                                        className="h-9"
                                      />
                                      <CommandEmpty>
                                        Fikstür bulunamadı
                                      </CommandEmpty>
                                      <CommandList>
                                        <CommandGroup className="max-h-64 overflow-y-auto">
                                          {fixtures?.map((fixture) => (
                                            <CommandItem
                                              value={fixture.code}
                                              key={fixture.code}
                                              onSelect={() => {
                                                form.setValue(
                                                  `process_configs.${index}.fixture`,
                                                  fixture.code
                                                );
                                              }}
                                            >
                                              {fixture.code} -{" "}
                                              {fixture.name || "Fikstür"}
                                              <Check
                                                className={cn(
                                                  "ml-auto h-4 w-4",
                                                  fixture.code === field.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
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
                            name={`process_configs.${index}.machine_time`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Makine Süresi (sn)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`process_configs.${index}.setup_time`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Kurulum Süresi (sn)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`process_configs.${index}.net_time`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Net Süre (sn)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`process_configs.${index}.axis_count`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Eksen Sayısı</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Eksen sayısı seçin" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.entries(AxisCount).map(
                                      ([key, value]) => (
                                        <SelectItem key={key} value={value}>
                                          {value === AxisCount.NINE_AXIS &&
                                            "9 Eksen"}
                                          {value ===
                                            AxisCount.EIGHT_POINT_FIVE_AXIS &&
                                            "8.5 Eksen"}
                                          {value === AxisCount.FIVE_AXIS &&
                                            "5 Eksen"}
                                          {value === AxisCount.FOUR_AXIS &&
                                            "4 Eksen"}
                                          {value === AxisCount.THREE_AXIS &&
                                            "3 Eksen"}
                                          {value === AxisCount.TWO_AXIS &&
                                            "2 Eksen"}
                                          {value === AxisCount.ONE_AXIS &&
                                            "1 Eksen"}
                                          {value === AxisCount.NONE &&
                                            "Eksen yok"}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`process_configs.${index}.number_of_bindings`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bağlama Sayısı</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`process_configs.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Açıklama</FormLabel>
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
          <Button type="submit">İş Akışı Oluştur</Button>
        </div>
      </form>
    </Form>
  );
}
