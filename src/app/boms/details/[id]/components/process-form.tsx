"use client";

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
import {
  ProcessComponent,
  ManufacturingProcess,
  AxisCount,
} from "@/types/manufacture";
import { toast } from "sonner";
import { useProcess, useProcesses } from "@/hooks/useManufacturing";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useCreateProcessComponent } from "@/hooks/useComponents";
import { useProcessConfigs } from "@/hooks/useProcessConfig";
import { useRawMaterials } from "@/hooks/useRawMaterials";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProcessProducts } from "@/hooks/useProducts";

const processFormSchema = z.object({
  process_config: z.number(),
  process_product: z.number().optional(),
  sequence_order: z.number().min(1, "Sıra numarası gereklidir"),
  raw_material: z.number().nullable(),
  axis_count: z.nativeEnum(AxisCount).optional(),
  estimated_duration_minutes: z
    .number()
    .min(0, "Süre 0'dan küçük olamaz")
    .optional(),
  tooling_requirements: z.string().optional(),
  quality_checks: z.string().optional(),
  notes: z.string().optional(),
  bom: z.number(),
});

type ProcessFormValues = z.infer<typeof processFormSchema>;

interface ProcessFormProps {
  bomId: number;
  onClose: () => void;
  onCreateProcess?: () => void;
  onCreateProcessProduct?: () => void;
}

export function ProcessForm({
  bomId,
  onClose,
  onCreateProcess,
  onCreateProcessProduct,
}: ProcessFormProps) {
  const { data: processes = [], isLoading: isLoadingProcesses } =
    useProcesses();
  const { data: processes_product = [], isLoading: isLoadingProcessesProduct } =
    useProcessProducts();
  const { data: rawMaterials = [], isLoading: isLoadingRawMaterials } =
    useRawMaterials({});
  const { mutateAsync: createComponent, isPending: isCreating } =
    useCreateProcessComponent();
  const [openProcessConfig, setOpenProcessConfig] = useState(false);
  const [openProcessProduct, setOpenProcessProduct] = useState(false);
  const [openRawMaterial, setOpenRawMaterial] = useState(false);

  const form = useForm<ProcessFormValues>({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      sequence_order: 1,
      process_product: undefined,
      raw_material: null,
      axis_count: undefined,
      estimated_duration_minutes: undefined,
      tooling_requirements: "",
      quality_checks: "",
      notes: "",
      bom: bomId,
    },
  });

  const handleSubmit = async (values: ProcessFormValues) => {
    try {
      const selectedProcess = processes.find(
        (process) => process.id === values.process_config
      );

      if (!selectedProcess) {
        toast.error("Seçilen proses bulunamadı");
        return;
      }

      const componentData = {
        ...values,
        raw_material: values.raw_material || undefined,
        component_type: "PROCESS" as const,
        details: {
          type: "PROCESS" as const,
          process_config: {
            id: selectedProcess.id,
            process_name: selectedProcess.process_name,
            process_code: selectedProcess.process_code,
            machine_type: selectedProcess.machine_type,
            axis_count: values.axis_count,
            estimated_duration_minutes: values.estimated_duration_minutes,
            tooling_requirements: values.tooling_requirements,
            quality_checks: values.quality_checks,
          },
          process_product: values.process_product,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await createComponent(
        componentData as unknown as Omit<ProcessComponent, "id">
      );
      toast.success("Proses başarıyla eklendi");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Proses eklenirken bir hata oluştu");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="process_config"
            render={({ field }) => (
              <FormItem className="flex flex-col col-span-2">
                <FormLabel>Proses Yapılandırma</FormLabel>
                <div className="flex gap-2">
                  <Popover
                    open={openProcessConfig}
                    onOpenChange={setOpenProcessConfig}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openProcessConfig}
                          className={cn(
                            "justify-between w-full",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoadingProcesses}
                        >
                          {field.value
                            ? processes.find(
                                (process) => process.id === field.value
                              )?.process_name || "Proses Seçin"
                            : "Proses Seçin"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0"
                      align="start"
                      sideOffset={4}
                    >
                      <Command className="w-full">
                        <CommandInput
                          placeholder="Proses ara..."
                          className="h-9"
                        />
                        <CommandEmpty>
                          Proses bulunamadı. Yeni bir proses oluşturmak için
                          sağdaki butona tıklayın.
                        </CommandEmpty>
                        <CommandList className="max-h-[200px] overflow-y-auto">
                          <CommandGroup heading="Prosesler">
                            {processes.map((process) => (
                              <CommandItem
                                key={process.id}
                                value={`${process.process_name} ${process.process_code}`}
                                onSelect={() => {
                                  form.setValue("process_config", process.id);
                                  setOpenProcessConfig(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    process.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{process.process_name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {process.process_code}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {onCreateProcess && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={onCreateProcess}
                      title="Yeni Proses Oluştur"
                      className="hover:bg-green-50 hover:border-green-200 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="process_product"
            render={({ field }) => (
              <FormItem className="flex flex-col col-span-2">
                <FormLabel>Proses Ürünü</FormLabel>
                <div className="flex gap-2">
                  <Popover
                    open={openProcessProduct}
                    onOpenChange={setOpenProcessProduct}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openProcessProduct}
                          className={cn(
                            "justify-between w-full",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoadingProcessesProduct}
                        >
                          {field.value
                            ? processes_product.find(
                                (product) => product.id === field.value
                              )?.parent_product_details.product_name ||
                              "Proses Ürünü Seçin"
                            : "Proses Ürünü Seçin"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0"
                      align="start"
                      sideOffset={4}
                    >
                      <Command className="w-full">
                        <CommandInput
                          placeholder="Proses ürünü ara..."
                          className="h-9"
                        />
                        <CommandEmpty>Proses ürünü bulunamadı.</CommandEmpty>
                        <CommandList className="max-h-[200px] overflow-y-auto">
                          <CommandGroup heading="Proses Ürünleri">
                            {processes_product.map((product) => (
                              <CommandItem
                                key={product.id}
                                value={`${product.parent_product_details.product_name} ${product.parent_product_details.product_code}`}
                                onSelect={() => {
                                  form.setValue("process_product", product.id);
                                  setOpenProcessProduct(false);
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
                                <div className="flex flex-col">
                                  <span>
                                    {
                                      product.parent_product_details
                                        .product_name
                                    }
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {
                                      product.parent_product_details
                                        .product_code
                                    }
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {onCreateProcessProduct && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={onCreateProcessProduct}
                      title="Yeni Proses Ürünü Oluştur"
                      className="hover:bg-green-50 hover:border-green-200 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="raw_material"
            render={({ field }) => (
              <FormItem className="flex flex-col col-span-2">
                <FormLabel>Hammadde</FormLabel>
                <div className="flex gap-2">
                  <Popover
                    open={openRawMaterial}
                    onOpenChange={setOpenRawMaterial}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openRawMaterial}
                          className={cn(
                            "justify-between w-full",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoadingRawMaterials}
                        >
                          {field.value
                            ? rawMaterials.find(
                                (material) => material.id === field.value
                              )?.material_name || "Hammadde Seçin"
                            : "Hammadde Seçin"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0"
                      align="start"
                      sideOffset={4}
                    >
                      <Command className="w-full">
                        <CommandInput
                          placeholder="Hammadde ara..."
                          className="h-9"
                        />
                        <CommandEmpty>Hammadde bulunamadı.</CommandEmpty>
                        <CommandList className="max-h-[200px] overflow-y-auto">
                          <CommandGroup heading="Hammaddeler">
                            {rawMaterials.map((material) => (
                              <CommandItem
                                key={material.id}
                                value={`${material.material_name} ${material.material_code}`}
                                onSelect={() => {
                                  form.setValue("raw_material", material.id);
                                  setOpenRawMaterial(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    material.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{material.material_name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {material.material_code}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sequence_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sıra Numarası</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Örn: 1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="axis_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Eksen Sayısı</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Eksen sayısı seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(AxisCount).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value}
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
            name="estimated_duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tahmini Süre (Dakika)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Örn: 30"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tooling_requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Takım Gereksinimleri</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Takım gereksinimleri..."
                    className="resize-none h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quality_checks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kalite Kontrolleri</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Kalite kontrolleri..."
                    className="resize-none h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notlar</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Proses hakkında notlar..."
                  className="resize-none h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button
            type="submit"
            disabled={isCreating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isCreating ? "Ekleniyor..." : "Prosesi Ekle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
