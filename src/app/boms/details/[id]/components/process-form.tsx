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
import { ProcessComponent } from "@/types/manufacture";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProcessConfigs } from "@/hooks/useProcessConfigs";
import { toast } from "sonner";
import { useCreateProcessComponent } from "@/hooks/useProcesesComp";

const processFormSchema = z.object({
  process_config: z.number(),
  sequence_order: z.number().min(1),
  raw_material: z.number().nullable(),
  notes: z.string().optional(),
  bom: z.number(),
});

type ProcessFormValues = z.infer<typeof processFormSchema>;

interface ProcessFormProps {
  bomId: number;
  onClose: () => void;
}

export function ProcessForm({ bomId, onClose }: ProcessFormProps) {
  const { data: processConfigs, isLoading: isLoadingConfigs } =
    useProcessConfigs();
  const processConfig = useProcessConfigs();
  const { mutateAsync: createComponent } = useCreateProcessComponent();

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
      const componentData = {
        ...values,
        raw_material: values.raw_material || undefined,
        component_type: "PROCESS" as const,
        details: {
          type: "PROCESS" as const,
          process_config: processConfigs!.find(
            (config) => config.id === values.process_config
          )!,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await createComponent(componentData as unknown as Omit<ProcessComponent, "id">);
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
            <FormItem>
              <FormLabel>Proses Yapılandırma</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={isLoadingConfigs}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Proses Yapılandırma Seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {processConfigs?.map((config) => (
                    <SelectItem key={config.id} value={config.id.toString()}>
                      {config.process} - {config.axis_count}
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
          name="sequence_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sıra</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="raw_material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hammadde</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === "null" ? null : Number(value))
                }
                value={field.value?.toString() || "null"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Hammadde Seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">Yok</SelectItem>
                  <SelectItem value="1">Hammadde 1</SelectItem>
                  <SelectItem value="2">Hammadde 2</SelectItem>
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit">Proses Ekle</Button>
        </div>
      </form>
    </Form>
  );
}
