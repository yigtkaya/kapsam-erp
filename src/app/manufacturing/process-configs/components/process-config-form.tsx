"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AxisCount,
  BOMProcessConfig,
  ManufacturingProcess,
  MachineType,
} from "@/types/manufacture";
import {
  useCreateProcessConfig,
  useUpdateProcessConfig,
} from "@/hooks/useProcessConfig";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RawMaterial } from "@/types/inventory";
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
import { useProcessProducts } from "@/hooks/useProducts";
import { ProcessProductDialog } from "@/app/boms/details/[id]/components/process-product-dialog";

const processConfigSchema = z.object({
  process: z.number(),
  process_product: z.number(),
  axis_count: z.nativeEnum(AxisCount).optional(),
  estimated_duration_minutes: z.number().min(0).optional(),
  tooling_requirements: z.string().optional(),
  quality_checks: z.string().optional(),
});

type ProcessConfigFormData = z.infer<typeof processConfigSchema>;

interface ProcessConfigFormProps {
  initialData?: Partial<BOMProcessConfig>;
  processes?: ManufacturingProcess[];
  onCreateProcess?: () => void;
  isDialog?: boolean;
  onSuccess?: (config: BOMProcessConfig) => void;
}

export function ProcessConfigForm({
  initialData,
  processes = [],
  onCreateProcess,
  isDialog = false,
  onSuccess,
}: ProcessConfigFormProps) {
  const router = useRouter();
  const createConfig = useCreateProcessConfig();
  const updateConfig = useUpdateProcessConfig();
  const [openProcess, setOpenProcess] = useState(false);
  const [openProcessProduct, setOpenProcessProduct] = useState(false);
  const [openProcessProductDialog, setOpenProcessProductDialog] =
    useState(false);
  const { data: processes_product = [], isLoading: isLoadingProcessesProduct } =
    useProcessProducts();
  const [selectedProcess, setSelectedProcess] =
    useState<ManufacturingProcess | null>(
      initialData?.process
        ? processes.find((p) => p.id === initialData.process) || null
        : null
    );

  const form = useForm<ProcessConfigFormData>({
    resolver: zodResolver(processConfigSchema),
    defaultValues: {
      process: initialData?.process || undefined,
      process_product: initialData?.process_product || undefined,
      axis_count: initialData?.axis_count,
      estimated_duration_minutes: initialData?.estimated_duration_minutes,
      tooling_requirements: initialData?.tooling_requirements || "",
      quality_checks: initialData?.quality_checks || "",
    },
  });

  const handleSubmit = async (data: ProcessConfigFormData) => {
    try {
      if (!selectedProcess) {
        toast.error("Lütfen bir süreç seçin");
        return;
      }

      const formattedData = {
        ...data,
        tooling_requirements: data.tooling_requirements,
        quality_checks: data.quality_checks,
      };

      if (initialData?.id) {
        const updatedConfig = await updateConfig.mutateAsync({
          id: initialData.id,
          data: {
            ...formattedData,
            id: initialData.id,
          },
        });
        toast.success("İşlem yapılandırması başarıyla güncellendi");
        onSuccess?.(updatedConfig);
      } else {
        const newConfig = await createConfig.mutateAsync({
          ...formattedData,
          process_name: selectedProcess.process_name,
          process_code: selectedProcess.process_code,
          machine_type: selectedProcess.machine_type ?? MachineType.NONE,
          raw_material_details: undefined as unknown as RawMaterial,
          process_product: data.process_product || null,
          process_product_details: null,
        });
        toast.success("İşlem yapılandırması başarıyla oluşturuldu");
        onSuccess?.(newConfig);
      }

      if (!isDialog) {
        router.push("/manufacturing/process-configs");
        router.refresh();
      }
    } catch (error) {
      toast.error("İşlem yapılandırması kaydedilirken bir hata oluştu");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="process"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Süreç</FormLabel>
              <div className="flex gap-2">
                <Popover open={openProcess} onOpenChange={setOpenProcess}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openProcess}
                        className={cn(
                          "justify-between w-full",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? processes.find(
                              (process) => process.id === field.value
                            )?.process_name || "Süreç Seçin"
                          : "Süreç Seçin"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Süreç ara..." />
                      <CommandEmpty>
                        Süreç bulunamadı. Yeni bir süreç oluşturmak için sağdaki
                        butona tıklayın.
                      </CommandEmpty>
                      <CommandList>
                        <CommandGroup heading="Süreçler">
                          {processes.map((process) => (
                            <CommandItem
                              key={process.id}
                              value={process.process_name}
                              onSelect={() => {
                                form.setValue("process", process.id);
                                setSelectedProcess(process);
                                setOpenProcess(false);
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
                    title="Yeni Süreç Oluştur"
                    className="hover:bg-green-50 hover:border-green-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormDescription>
                Yapılandırmanın uygulanacağı üretim sürecini seçin
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="process_product"
          render={({ field }) => (
            <FormItem>
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
                        {isLoadingProcessesProduct
                          ? "Yükleniyor..."
                          : field.value
                          ? (() => {
                              const product = processes_product.find(
                                (product) => product.id === field.value
                              );
                              return product
                                ? `${product.parent_product_details.product_name} (${product.parent_product_details.product_code}) - ${product.product_code}`
                                : "Proses Ürünü Seçin";
                            })()
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
                      <CommandEmpty>
                        {isLoadingProcessesProduct
                          ? "Yükleniyor..."
                          : "Proses ürünü bulunamadı."}
                      </CommandEmpty>
                      <CommandList className="max-h-[200px] overflow-y-auto">
                        <CommandGroup heading="Proses Ürünleri">
                          {processes_product.map((product) => (
                            <CommandItem
                              key={product.id}
                              value={`${product.parent_product_details.product_name} ${product.parent_product_details.product_code} ${product.product_code}`}
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
                                <span className="font-medium">
                                  {product.parent_product_details.product_name}{" "}
                                  ({product.product_code})
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Proses Stok Kodu:{" "}
                                  {product.parent_product_details.product_code}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setOpenProcessProductDialog(true)}
                  title="Yeni Proses Ürünü Oluştur"
                  className="hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription>
                Bu proses yapılandırması için kullanılacak proses ürününü seçin.
                Proses ürünü, bu süreçte işlenecek veya üretilecek olan ürünü
                temsil eder.
              </FormDescription>
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
                  {Object.values(AxisCount).map((axis) => (
                    <SelectItem key={axis} value={axis}>
                      {axis}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                İşlem için gerekli eksen sayısını seçin
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimated_duration_minutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahmini Süre (dakika)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value, 10) : undefined
                    )
                  }
                />
              </FormControl>
              <FormDescription>
                İşlemin tahmini süresini dakika cinsinden girin
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tooling_requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Takım Gereksinimleri</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Takım gereksinimlerini girin..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Gerekli takımları ve özelliklerini belirtin
              </FormDescription>
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
                  placeholder="Kalite kontrollerini girin..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kalite kontrol noktalarını ve kriterlerini belirtin
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={createConfig.isPending || updateConfig.isPending}
          >
            {initialData?.id ? "Güncelle" : "Oluştur"}
          </Button>
        </div>
      </form>

      <ProcessProductDialog
        open={openProcessProductDialog}
        onOpenChange={setOpenProcessProductDialog}
      />
    </Form>
  );
}
