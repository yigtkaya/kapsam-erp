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
import { ProcessComponent, ManufacturingProcess } from "@/types/manufacture";
import { toast } from "sonner";
import { useProcesses } from "@/hooks/useManufacturing";
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

const processFormSchema = z.object({
  process_config: z.number(),
  sequence_order: z.number().min(1, "Sıra numarası gereklidir"),
  raw_material: z.number().nullable(),
  notes: z.string().optional(),
  bom: z.number(),
});

type ProcessFormValues = z.infer<typeof processFormSchema>;

interface ProcessFormProps {
  bomId: number;
  onClose: () => void;
  onCreateProcess?: () => void;
}

export function ProcessForm({
  bomId,
  onClose,
  onCreateProcess,
}: ProcessFormProps) {
  const { data: processes = [], isLoading: isLoadingProcesses } =
    useProcesses();
  const { mutateAsync: createComponent, isPending: isCreating } =
    useCreateProcessComponent();
  const [openProcessConfig, setOpenProcessConfig] = useState(false);

  const form = useForm<ProcessFormValues>({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      sequence_order: 1,
      raw_material: null,
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
          },
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
      toast.error("Proses eklenirken bir hata oluştu");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="process_config"
          render={({ field }) => (
            <FormItem className="flex flex-col">
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
                    className="p-0 w-[--radix-popover-trigger-width] min-w-[240px]"
                    align="start"
                    sideOffset={4}
                  >
                    <Command className="max-h-[300px]">
                      <CommandInput placeholder="Proses ara..." />
                      <CommandEmpty>
                        Proses bulunamadı. Yeni bir proses oluşturmak için
                        aşağıdaki butona tıklayın.
                      </CommandEmpty>
                      <CommandList className="max-h-[250px] overflow-y-auto">
                        <CommandGroup heading="Prosesler">
                          {processes.map((process) => (
                            <CommandItem
                              key={process.id}
                              value={process.process_name}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notlar</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Proses hakkında notlar..."
                  className="resize-none"
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
