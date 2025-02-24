"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateProcess, useUpdateProcess } from "@/hooks/useManufacturing";
import { ManufacturingProcess, MachineType } from "@/types/manufacture";

const formSchema = z.object({
  process_code: z.string().min(1, "Süreç kodu gereklidir"),
  process_name: z.string().min(1, "Süreç adı gereklidir"),
  standard_time_minutes: z.coerce
    .number()
    .min(0, "Standart süre 0'dan büyük olmalıdır"),
  machine_type: z.nativeEnum(MachineType, {
    errorMap: () => ({ message: "Geçerli bir makine tipi seçin" }),
  }),
});

type ProcessFormValues = z.infer<typeof formSchema>;

interface ProcessFormProps {
  process?: ManufacturingProcess;
}

export function ProcessForm({ process }: ProcessFormProps) {
  const router = useRouter();
  const { mutate: createProcess, isPending: isCreating } = useCreateProcess();
  const { mutate: updateProcess, isPending: isUpdating } = useUpdateProcess();

  const form = useForm<ProcessFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: process
      ? {
          ...process,
        }
      : {
          process_code: "",
          process_name: "",
          standard_time_minutes: 0,
          machine_type: MachineType.PROCESSING_CENTER,
        },
  });

  function onSubmit(values: ProcessFormValues) {
    if (process) {
      updateProcess(
        {
          id: process.id,
          data: values,
        },
        {
          onSuccess: () => {
            toast.success("Süreç başarıyla güncellendi");
            router.push("/manufacturing/processes");
          },
          onError: (error) => {
            toast.error(`Süreç güncellenirken hata oluştu: ${error.message}`);
          },
        }
      );
    } else {
      createProcess(values, {
        onSuccess: () => {
          toast.success("Süreç başarıyla oluşturuldu");
          router.push("/manufacturing/processes");
        },
        onError: (error) => {
          toast.error(`Süreç oluşturulurken hata oluştu: ${error.message}`);
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="process_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Süreç Kodu*</FormLabel>
                <FormControl>
                  <Input placeholder="Süreç kodu girin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="process_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Süreç Adı*</FormLabel>
                <FormControl>
                  <Input placeholder="Süreç adı girin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="standard_time_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Standart Süre (dk)*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Standart süre girin"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="machine_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Makine Tipi*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Makine tipi seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(MachineType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/manufacturing/processes")}
          >
            İptal
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {process ? "Güncelle" : "Oluştur"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
