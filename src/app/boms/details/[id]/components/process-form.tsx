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
  BOMProcessConfig,
} from "@/types/manufacture";
import { toast } from "sonner";
import { useProcess, useProcesses } from "@/hooks/useManufacturing";
import { Check, ChevronsUpDown, Plus, ArrowLeft } from "lucide-react";
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
import { CreateProcessConfigDialog } from "@/app/manufacturing/process-configs/components/create-process-config-dialog";
import { CreateProcessDialog } from "@/app/manufacturing/processes/components/create-process-dialog";
import { ProcessConfigForm } from "@/app/manufacturing/process-configs/components/process-config-form";

const processFormSchema = z.object({
  process_config: z.number(),
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
  onCreateProcessConfig?: () => void;
}

export function ProcessForm({
  bomId,
  onClose,
  onCreateProcessConfig,
}: ProcessFormProps) {
  const { data: processConfigs = [], isLoading: isLoadingProcessConfigs } =
    useProcessConfigs();
  const { data: rawMaterials = [], isLoading: isLoadingRawMaterials } =
    useRawMaterials({});
  const { mutateAsync: createComponent, isPending: isCreating } =
    useCreateProcessComponent();
  const [openProcessConfig, setOpenProcessConfig] = useState(false);
  const [openRawMaterial, setOpenRawMaterial] = useState(false);
  const [isCreatingProcessConfig, setIsCreatingProcessConfig] = useState(false);
  const [createProcessOpen, setCreateProcessOpen] = useState(false);
  const [selectedProcessConfig, setSelectedProcessConfig] =
    useState<BOMProcessConfig | null>(null);
  const { data: processes = [] } = useProcesses();

  const form = useForm<ProcessFormValues>({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      sequence_order: 1,
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
      if (!selectedProcessConfig) {
        toast.error("Proses yapılandırması seçilmedi");
        return;
      }

      const componentData = {
        ...values,
        raw_material: values.raw_material || undefined,
        details: {
          process_config: selectedProcessConfig,
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
    <>
      {isCreatingProcessConfig ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreatingProcessConfig(false)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri Dön
            </Button>
            <h3 className="text-lg font-semibold">
              Yeni Proses Yapılandırması
            </h3>
          </div>
          <ProcessConfigForm
            processes={processes}
            isDialog
            onCreateProcess={() => setCreateProcessOpen(true)}
            onSuccess={(newConfig) => {
              setSelectedProcessConfig(newConfig);
              form.setValue("process_config", newConfig.id);
              setIsCreatingProcessConfig(false);
              toast.success("Proses yapılandırması başarıyla oluşturuldu");
            }}
          />
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
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
                              disabled={isLoadingProcessConfigs}
                            >
                              {field.value
                                ? processConfigs.find(
                                    (config) => config.id === field.value
                                  )?.process_name ||
                                  "Proses Yapılandırması Seçin"
                                : "Proses Yapılandırması Seçin"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Proses yapılandırması ara..." />
                            <CommandEmpty>
                              Proses yapılandırması bulunamadı.
                            </CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {processConfigs.map((config) => (
                                  <CommandItem
                                    key={config.id}
                                    value={`${config.process_name} ${config.process_code}`}
                                    onSelect={() => {
                                      form.setValue(
                                        "process_config",
                                        config.id
                                      );
                                      setSelectedProcessConfig(config);
                                      setOpenProcessConfig(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        config.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span>
                                        {config.process_name} -
                                        {config.process_code}
                                        {config.process_product_details
                                          ?.product_code ||
                                          config.raw_material_details
                                            ?.material_code}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {config.machine_type}
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
                        onClick={() => {
                          setIsCreatingProcessConfig(true);
                          setOpenProcessConfig(false);
                        }}
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
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
                                      form.setValue(
                                        "raw_material",
                                        material.id
                                      );
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
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
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
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
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
      )}

      <CreateProcessDialog
        open={createProcessOpen}
        onOpenChange={setCreateProcessOpen}
      />
    </>
  );
}
