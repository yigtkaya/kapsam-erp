"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  AxisCount,
  ProcessConfig,
  ProcessConfigStatus,
} from "@/types/manufacture";
import { useProcesses } from "@/hooks/useManufacturing";
import { toast } from "sonner";
import { useParams } from "next/navigation";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTools } from "@/hooks/use-tools";
import { useFixtures } from "@/hooks/useFixture";
import { useGauges } from "@/hooks/useGauges";
import {
  useCreateProcessConfig,
  useProcessConfig,
  useUpdateProcessConfig,
} from "../hooks/useProcessConfig";

// Schema for the process configuration
const formSchema = z.object({
  workflow_process: z.number({
    required_error: "İş akışı prosesi gereklidir",
    invalid_type_error: "İş akışı prosesi bir sayı olmalıdır",
  }),
  sequence_order: z.coerce
    .number()
    .min(1, "Sıra numarası 1'den büyük olmalıdır"),
  tool: z.string().nullable(),
  control_gauge: z.string().nullable(),
  fixture: z.string().nullable(),
  axis_count: z
    .nativeEnum(AxisCount, {
      errorMap: () => ({ message: "Geçerli bir eksen sayısı seçin" }),
    })
    .nullable(),
  machine_time: z.coerce
    .number()
    .min(0, "Tezgah süresi 0'dan büyük olmalıdır")
    .nullable(),
  setup_time: z.coerce
    .number()
    .min(0, "Hazırlık süresi 0'dan büyük olmalıdır")
    .nullable(),
  net_time: z.coerce
    .number()
    .min(0, "Net süre 0'dan büyük olmalıdır")
    .nullable(),
  number_of_bindings: z.coerce
    .number()
    .min(0, "Bağlama sayısı 0'dan büyük olmalıdır")
    .nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProcessConfigFormProps {
  workflowProcessId: number;
  configId?: number;
  onSuccess: () => void;
  onCancel: () => void;
  isReadOnly?: boolean;
}

export function ProcessConfigForm({
  workflowProcessId,
  configId,
  onSuccess,
  onCancel,
  isReadOnly = false,
}: ProcessConfigFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!configId;
  const params = useParams();

  const { data: processes, isLoading: processesLoading } = useProcesses();
  const { data: tools, isLoading: toolsLoading } = useTools();
  const { data: gauges, isLoading: gaugesLoading } = useGauges();
  const { data: fixtures, isLoading: fixturesLoading } = useFixtures();
  const { data: existingConfig, isLoading: configLoading } = useProcessConfig(
    isEditing ? (configId as number) : 0
  );
  const { mutateAsync: createProcessConfig } = useCreateProcessConfig();
  const { mutateAsync: updateProcessConfig } = useUpdateProcessConfig();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workflow_process: workflowProcessId,
      sequence_order: 1,
      tool: null,
      control_gauge: null,
      fixture: null,
      axis_count: null,
      machine_time: null,
      setup_time: null,
      net_time: null,
      number_of_bindings: null,
    },
  });

  // Add this to debug form state
  useEffect(() => {
    console.log("Form values:", form.getValues());
    console.log("Form errors:", form.formState.errors);
  }, [form.formState]);

  // Load existing data when editing
  useEffect(() => {
    if (isEditing && existingConfig) {
      form.reset({
        workflow_process: workflowProcessId,
        sequence_order: existingConfig.sequence_order,
        tool:
          typeof existingConfig.tool === "string"
            ? existingConfig.tool
            : existingConfig.tool,
        control_gauge:
          typeof existingConfig.control_gauge === "string"
            ? existingConfig.control_gauge
            : existingConfig.control_gauge,
        fixture:
          typeof existingConfig.fixture === "string"
            ? existingConfig.fixture
            : existingConfig.fixture,
        axis_count: existingConfig.axis_count,
        machine_time: existingConfig.machine_time,
        setup_time: existingConfig.setup_time,
        net_time: existingConfig.net_time,
        number_of_bindings: existingConfig.number_of_bindings,
      });
    }
  }, [isEditing, existingConfig, form, workflowProcessId]);

  const onSubmit = async (data: FormValues) => {
    console.log("Submit attempt with data:", data);
    console.log("Form state:", form.formState);

    if (!data.workflow_process) {
      console.error("workflow_process is required");
      toast.error("İş akışı prosesi gereklidir");
      return;
    }

    setIsSubmitting(true);
    try {
      const baseData = {
        workflow: workflowProcessId,
        process: data.workflow_process,
        process_code:
          processes?.find((p) => p.id === data.workflow_process)
            ?.process_code || "",
        process_name:
          processes?.find((p) => p.id === data.workflow_process)
            ?.process_name || "",
        version: "1.0",
        sequence_order: data.sequence_order,
        stock_code: "",
        number_of_bindings: data.number_of_bindings ?? 0,
        modified_at: new Date().toISOString(),
        tool: data.tool ?? undefined,
        control_gauge: data.control_gauge ?? undefined,
        fixture: data.fixture ?? undefined,
        axis_count: data.axis_count ?? undefined,
        machine_time: data.machine_time ?? undefined,
        setup_time: data.setup_time ?? undefined,
        net_time: data.net_time ?? undefined,
      };

      if (isEditing && configId) {
        console.log("Updating config with ID:", configId);
        await updateProcessConfig({
          id: configId,
          data: baseData,
        });
        toast.success("Proses konfigürasyonu başarıyla güncellendi");
      } else {
        console.log("Creating new config");
        const result = await createProcessConfig({
          ...baseData,
          status: ProcessConfigStatus.DRAFT,
        });
        console.log("Create result:", result);
      }
      onSuccess();
    } catch (error) {
      console.error(
        "Proses konfigürasyonu kaydedilirken bir hata oluştu:",
        error
      );
      toast.error(
        `Proses konfigürasyonu ${
          isEditing ? "güncellenemedi" : "oluşturulamadı"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading =
    processesLoading ||
    toolsLoading ||
    gaugesLoading ||
    fixturesLoading ||
    (isEditing && configLoading);

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          {isEditing
            ? "Bu iş akışı prosesi için konfigürasyon detaylarını güncelleyin"
            : "Bu iş akışı prosesine yeni bir konfigürasyon ekleyin"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            console.log("Form submission triggered");
            form.handleSubmit(onSubmit)(e);
          }}
        >
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* <FormField
                control={form.control}
                name="process"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>İmalat Prosesi</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={isLoading || isReadOnly}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? processes?.find(
                                  (process) => process.id === field.value
                                )?.process_name || "Select process"
                              : "Select process"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <CommandList>
                          <CommandInput placeholder="Proses ara..." />
                          <CommandEmpty>Proses bulunamadı.</CommandEmpty>
                          <CommandGroup>
                            {processes?.map((process) => (
                              <CommandItem
                                value={process.process_name}
                                key={process.id}
                                onSelect={() => {
                                  form.setValue("process", process.id);
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
                                {process.process_name} ({process.process_code})
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Kullanılacak imalat prosesi
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="sequence_order"
                render={({ field }) => (
                  <FormItem className="flex flex-col h-[120px]">
                    <FormLabel>Sıra Numarası</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Sıra numarasını girin"
                        disabled={isReadOnly}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? null : parseInt(value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>Prosesin sıra numarası</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tool"
                render={({ field }) => (
                  <FormItem className="flex flex-col h-[120px]">
                    <FormLabel>Takım</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={isLoading || isReadOnly}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? tools?.find(
                                  (tool) => tool.stock_code === field.value
                                )?.stock_code || "Takım seçin"
                              : "Takım seçin"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Takım ara..." />
                          <CommandList>
                            <CommandEmpty>Takım bulunamadı.</CommandEmpty>
                            <CommandGroup>
                              {tools?.map((tool) => (
                                <CommandItem
                                  value={tool.stock_code}
                                  key={tool.stock_code}
                                  onSelect={() => {
                                    form.setValue("tool", tool.stock_code);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      tool.stock_code === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {tool.stock_code} - {tool.tool_type}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Bu proses için gerekli takım
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="control_gauge"
                render={({ field }) => (
                  <FormItem className="flex flex-col h-[120px]">
                    <FormLabel>Kontrol Mastarı</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={isLoading || isReadOnly}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? gauges?.find(
                                  (gauge) => gauge.stock_code === field.value
                                )?.stock_code || "Mastar seçin"
                              : "Mastar seçin"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Mastar ara..." />
                          <CommandList>
                            <CommandEmpty>Mastar bulunamadı.</CommandEmpty>
                            <CommandGroup>
                              {gauges?.map((gauge) => (
                                <CommandItem
                                  value={gauge.stock_code}
                                  key={gauge.stock_code}
                                  onSelect={() => {
                                    form.setValue(
                                      "control_gauge",
                                      gauge.stock_code
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      gauge.stock_code === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {gauge.stock_code} - {gauge.stock_name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Kalite kontrolleri için mastar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fixture"
                render={({ field }) => (
                  <FormItem className="flex flex-col h-[120px]">
                    <FormLabel>Bağlama Aparatı</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={isLoading || isReadOnly}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? fixtures?.find(
                                  (fixture) => fixture.code === field.value
                                )?.code || "Bağlama aparatı seçin"
                              : "Bağlama aparatı seçin"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Bağlama aparatı ara..." />
                          <CommandList>
                            <CommandEmpty>
                              Bağlama aparatı bulunamadı.
                            </CommandEmpty>
                            <CommandGroup>
                              {fixtures?.map((fixture) => (
                                <CommandItem
                                  value={fixture.code}
                                  key={fixture.code}
                                  onSelect={() => {
                                    form.setValue("fixture", fixture.code);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      fixture.code === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {fixture.code}{" "}
                                  {fixture.name ? `- ${fixture.name}` : ""}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Bu proses için gerekli bağlama aparatı
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="axis_count"
                render={({ field }) => (
                  <FormItem className="flex flex-col h-[120px]">
                    <FormLabel>Eksen Sayısı</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={isLoading || isReadOnly}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? field.value || "Eksen sayısı seçin"
                              : "Eksen sayısı seçin"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Eksen sayısı ara..." />
                          <CommandList>
                            <CommandEmpty>
                              Eksen sayısı bulunamadı.
                            </CommandEmpty>
                            <CommandGroup>
                              {Object.values(AxisCount).map((value) => (
                                <CommandItem
                                  value={value}
                                  key={value}
                                  onSelect={() => {
                                    form.setValue("axis_count", value);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {value}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Tezgah eksen sayısı</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="machine_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col h-[120px]">
                    <FormLabel>Tezgah Süresi (sn)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Tezgah süresini girin"
                        disabled={isReadOnly}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? null : parseInt(value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>Tezgahta gerekli süre</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="setup_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col h-[120px]">
                    <FormLabel>Hazırlık Süresi (sn)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Hazırlık süresini girin"
                        disabled={isReadOnly}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? null : parseInt(value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Hazırlık için gerekli süre
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="net_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col h-[120px]">
                    <FormLabel>Net Süre (sn)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Net süreyi girin"
                        disabled={isReadOnly}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? null : parseInt(value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Proses için gerekli net süre
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="number_of_bindings"
                render={({ field }) => (
                  <FormItem className="flex flex-col h-[120px]">
                    <FormLabel>Bağlama Sayısı</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Bağlama sayısını girin"
                        disabled={isReadOnly}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? null : parseInt(value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>Gerekli bağlama sayısı</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              İptal
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Konfigürasyonu {isEditing ? "Güncelle" : "Oluştur"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
