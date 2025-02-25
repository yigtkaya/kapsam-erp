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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateMachine, useUpdateMachine } from "@/hooks/useManufacturing";
import {
  AxisCount,
  Machine,
  MachineStatus,
  MachineType,
} from "@/types/manufacture";
import { DatePicker } from "@/components/ui/date-picker";

const formSchema = z.object({
  machine_code: z.string().min(1, "Makine kodu gereklidir"),
  machine_type: z.nativeEnum(MachineType, {
    errorMap: () => ({ message: "Geçerli bir makine tipi seçin" }),
  }),
  brand: z.string().optional(),
  model: z.string().optional(),
  axis_count: z.nativeEnum(AxisCount).optional(),
  internal_cooling: z.coerce.number().nullable().optional(),
  motor_power_kva: z.coerce.number().nullable().optional(),
  holder_type: z.string().optional(),
  spindle_motor_power_10_percent_kw: z.coerce.number().nullable().optional(),
  spindle_motor_power_30_percent_kw: z.coerce.number().nullable().optional(),
  power_hp: z.coerce.number().nullable().optional(),
  spindle_speed_rpm: z.coerce.number().nullable().optional(),
  tool_count: z.coerce.number().nullable().optional(),
  nc_control_unit: z.string().optional(),
  manufacturing_year: z.string().nullable(),
  serial_number: z.string().optional(),
  machine_weight_kg: z.coerce.number().nullable().optional(),
  max_part_size: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(MachineStatus, {
    errorMap: () => ({ message: "Geçerli bir durum seçin" }),
  }),
  maintenance_interval: z.coerce
    .number()
    .min(1, "Bakım aralığı en az 1 gün olmalıdır"),
  last_maintenance_date: z.date().nullable(),
  next_maintenance_date: z.date().nullable(),
  maintenance_notes: z.string().optional(),
});

type MachineFormValues = z.infer<typeof formSchema>;

interface MachineFormProps {
  machine?: Machine;
}

export function MachineForm({ machine }: MachineFormProps) {
  const router = useRouter();
  const { mutate: createMachine, isPending: isCreating } = useCreateMachine();
  const { mutate: updateMachine, isPending: isUpdating } = useUpdateMachine();

  const defaultValues: Partial<MachineFormValues> = machine
    ? {
        machine_code: machine.machine_code,
        machine_type: machine.machine_type,
        brand: machine.brand,
        model: machine.model,
        axis_count: machine.axis_count,
        internal_cooling: machine.internal_cooling,
        motor_power_kva: machine.motor_power_kva,
        holder_type: machine.holder_type,
        spindle_motor_power_10_percent_kw:
          machine.spindle_motor_power_10_percent_kw,
        spindle_motor_power_30_percent_kw:
          machine.spindle_motor_power_30_percent_kw,
        power_hp: machine.power_hp,
        spindle_speed_rpm: machine.spindle_speed_rpm,
        tool_count: machine.tool_count,
        nc_control_unit: machine.nc_control_unit,
        manufacturing_year: machine.manufacturing_year,
        serial_number: machine.serial_number,
        machine_weight_kg: machine.machine_weight_kg,
        max_part_size: machine.max_part_size,
        description: machine.description,
        status: machine.status,
        maintenance_interval: machine.maintenance_interval,
        last_maintenance_date: machine.last_maintenance_date,
        next_maintenance_date: machine.next_maintenance_date,
        maintenance_notes: machine.maintenance_notes,
      }
    : {
        machine_code: "",
        machine_type: MachineType.PROCESSING_CENTER,
        status: MachineStatus.AVAILABLE,
        maintenance_interval: 30,
      };

  const form = useForm<MachineFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: MachineFormValues) {
    const submissionData = {
      ...values,
      manufacturing_year: values.manufacturing_year ?? null,
      last_maintenance_date: values.last_maintenance_date ?? null,
      next_maintenance_date: values.next_maintenance_date ?? null,
    };

    if (machine) {
      updateMachine(
        {
          id: machine.id,
          data: submissionData,
        },
        {
          onSuccess: () => {
            toast.success("Makine başarıyla güncellendi");
            router.push("/manufacturing/machines");
          },
          onError: (error) => {
            toast.error(`Makine güncellenirken hata oluştu: ${error.message}`);
          },
        }
      );
    } else {
      createMachine(submissionData, {
        onSuccess: () => {
          toast.success("Makine başarıyla oluşturuldu");
          router.push("/manufacturing/machines");
        },
        onError: (error) => {
          toast.error(`Makine oluşturulurken hata oluştu: ${error.message}`);
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
            name="machine_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Makine Kodu*</FormLabel>
                <FormControl>
                  <Input placeholder="Makine kodu girin" {...field} />
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

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marka</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Marka girin"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Model girin"
                    {...field}
                    value={field.value || ""}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durum*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={MachineStatus.AVAILABLE}>
                      Kullanılabilir
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maintenance_interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bakım Aralığı (Gün)*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Bakım aralığı girin"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_maintenance_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Son Bakım Tarihi</FormLabel>
                <DatePicker
                  date={field.value || undefined}
                  setDate={(date) => field.onChange(date || null)}
                  placeholder="Son bakım tarihini seçin"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="next_maintenance_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Sonraki Bakım Tarihi</FormLabel>
                <DatePicker
                  date={field.value || undefined}
                  setDate={(date) => field.onChange(date || null)}
                  placeholder="Sonraki bakım tarihini seçin"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Açıklama</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Makine hakkında açıklama girin"
                    className="resize-none"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maintenance_notes"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Bakım Notları</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Bakım notları girin"
                    className="resize-none"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/manufacturing/machines")}
          >
            İptal
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {machine ? "Güncelle" : "Oluştur"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
