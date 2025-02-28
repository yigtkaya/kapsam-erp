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
import { MachineType } from "@/types/manufacture";
import { useCreateProcess } from "@/hooks/useManufacturing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const processFormSchema = z.object({
  process_name: z.string().min(1, "Süreç adı gereklidir"),
  process_code: z.string().min(1, "Süreç kodu gereklidir"),
  standard_time_minutes: z.number().min(0, "Süre 0'dan küçük olamaz"),
  machine_type: z.nativeEnum(MachineType).nullable(),
});

type ProcessFormData = z.infer<typeof processFormSchema>;

interface CreateProcessFormProps {
  isDialog?: boolean;
  onSuccess?: () => void;
}

export function CreateProcessForm({
  isDialog,
  onSuccess,
}: CreateProcessFormProps) {
  const router = useRouter();
  const createProcess = useCreateProcess();

  const form = useForm<ProcessFormData>({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      process_name: "",
      process_code: "",
      standard_time_minutes: 0,
      machine_type: null,
    },
  });

  const handleSubmit = async (data: ProcessFormData) => {
    try {
      await createProcess.mutateAsync(data);
      toast.success("Süreç başarıyla oluşturuldu");
      if (onSuccess) {
        onSuccess();
      }
      if (!isDialog) {
        router.push("/manufacturing/processes");
        router.refresh();
      }
    } catch (error) {
      toast.error("Süreç oluşturulurken bir hata oluştu");
      console.error("Error creating process:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="process_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Süreç Adı</FormLabel>
              <FormControl>
                <Input placeholder="Örn: Malzeme Girişi" {...field} />
              </FormControl>
              <FormDescription>Sürecin tanımlayıcı adını girin</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="process_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Süreç Kodu</FormLabel>
              <FormControl>
                <Input placeholder="Örn: OP10" {...field} />
              </FormControl>
              <FormDescription>Sürecin benzersiz kodunu girin</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="standard_time_minutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Standart Süre (dakika)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value, 10) : 0
                    )
                  }
                />
              </FormControl>
              <FormDescription>
                Sürecin standart süresini dakika cinsinden girin
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="machine_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Makine Tipi</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value as MachineType | null)
                }
                value={field.value || undefined}
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
              <FormDescription>
                Süreç için gerekli makine tipini seçin
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={createProcess.isPending}>
            {createProcess.isPending ? "Oluşturuluyor..." : "Oluştur"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
