"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useUpdateMachine } from "@/hooks/useMachines";
import {
  Machine,
  MachineType,
  MachineStatus,
  AxisCount,
} from "@/types/manufacture";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const machineSchema = z.object({
  machine_code: z.string().nonempty("Makine kodu zorunludur"),
  machine_type: z.nativeEnum(MachineType, {
    errorMap: () => ({ message: "Makine tipi zorunludur" }),
  }),
  brand: z.string().nonempty("Marka zorunludur"),
  model: z.string().optional(),
  axis_count: z.nativeEnum(AxisCount).optional(),
  internal_cooling: z.number().min(0).nullable(),
  motor_power_kva: z.number().min(0).nullable(),
  holder_type: z.string().optional(),
  spindle_motor_power_10_percent_kw: z.number().min(0).nullable(),
  spindle_motor_power_30_percent_kw: z.number().min(0).nullable(),
  power_hp: z.number().min(0).nullable(),
  spindle_speed_rpm: z.number().min(0).nullable(),
  tool_count: z.number().min(0).nullable(),
  nc_control_unit: z.string().optional(),
  manufacturing_year: z.date().max(new Date()).optional(),
  machine_weight_kg: z.number().min(0).nullable(),
  max_part_size: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(MachineStatus, {
    errorMap: () => ({ message: "Durum zorunludur" }),
  }),
  maintenance_interval: z
    .number()
    .min(1, "Bakım aralığı en az 1 gün olmalıdır"),
});

type FormValues = z.infer<typeof machineSchema>;

interface EditMachineFormProps {
  machine: Machine;
}

export function EditMachineForm({ machine }: EditMachineFormProps) {
  const router = useRouter();
  const { mutateAsync: updateMachine } = useUpdateMachine();

  const form = useForm<FormValues>({
    resolver: zodResolver(machineSchema),
    defaultValues: {
      machine_code: machine.machine_code,
      machine_type: machine.machine_type,
      brand: machine.brand || "",
      model: machine.model || "",
      axis_count: machine.axis_count,
      internal_cooling: machine.internal_cooling,
      motor_power_kva: machine.motor_power_kva,
      holder_type: machine.holder_type || "",
      spindle_motor_power_10_percent_kw:
        machine.spindle_motor_power_10_percent_kw,
      spindle_motor_power_30_percent_kw:
        machine.spindle_motor_power_30_percent_kw,
      power_hp: machine.power_hp || null,
      spindle_speed_rpm: machine.spindle_speed_rpm || null,
      tool_count: machine.tool_count || null,
      nc_control_unit: machine.nc_control_unit || "",
      manufacturing_year: machine.manufacturing_year
        ? new Date(machine.manufacturing_year)
        : undefined,
      machine_weight_kg: machine.machine_weight_kg,
      max_part_size: machine.max_part_size || "",
      description: machine.description || "",
      status: machine.status,
      maintenance_interval: machine.maintenance_interval,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const updatedMachine = await updateMachine({
        id: machine.id || 0,
        machine_code: values.machine_code,
        machine_type: values.machine_type,
        brand: values.brand,
        model: values.model || "",
        axis_count: values.axis_count,
        internal_cooling: values.internal_cooling || null,
        motor_power_kva: values.motor_power_kva || null,
        holder_type: values.holder_type || "",
        spindle_motor_power_10_percent_kw:
          values.spindle_motor_power_10_percent_kw || null,
        spindle_motor_power_30_percent_kw:
          values.spindle_motor_power_30_percent_kw || null,
        power_hp: values.power_hp || null,
        spindle_speed_rpm: values.spindle_speed_rpm || null,
        tool_count: values.tool_count || null,
        nc_control_unit: values.nc_control_unit || "",
        manufacturing_year: values.manufacturing_year || null,
        machine_weight_kg: values.machine_weight_kg || null,
        max_part_size: values.max_part_size || "",
        description: values.description || "",
        status: values.status,
        maintenance_interval: values.maintenance_interval,
        serial_number: machine.serial_number,
        last_maintenance_date: null,
        next_maintenance_date: null,
        maintenance_notes: "",
      });

      if (updatedMachine.success) {
        toast.success("Makine başarıyla güncellendi");
        router.back();
        router.refresh();
      } else {
        toast.error("Makine güncellenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Error updating machine:", error);
      toast.error("Makine güncellenirken bir hata oluştu");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-2">Temel Bilgiler</h3>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="machine_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Makine Kodu</FormLabel>
                  <FormControl>
                    <Input placeholder="Makine kodunu girin" {...field} />
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
                  <FormLabel>Makine Tipi</FormLabel>
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
                    <Input placeholder="Marka girin" {...field} />
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
                    <Input placeholder="Model girin" {...field} />
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
                  <FormLabel>Durum</FormLabel>
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
                      {Object.values(MachineStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === MachineStatus.AVAILABLE
                            ? "Müsait"
                            : status === MachineStatus.IN_USE
                            ? "Kullanımda"
                            : status === MachineStatus.MAINTENANCE
                            ? "Bakımda"
                            : "Emekli"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Teknik Özellikler</h3>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="internal_cooling"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İç Soğutma (bar)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="İç soğutma değeri"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : e.target.valueAsNumber;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motor_power_kva"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motor Gücü (kVA)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Motor gücü"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : e.target.valueAsNumber;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="holder_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tutucu Tipi</FormLabel>
                  <FormControl>
                    <Input placeholder="Tutucu tipi girin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spindle_motor_power_10_percent_kw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spindle Motor Gücü %10 (kW)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Spindle motor gücü"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : e.target.valueAsNumber;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spindle_motor_power_30_percent_kw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spindle Motor Gücü %30 (kW)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Spindle motor gücü"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : e.target.valueAsNumber;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="power_hp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Güç (HP)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Güç değeri"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : e.target.valueAsNumber;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spindle_speed_rpm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spindle Hızı (RPM)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Spindle hızı"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : e.target.valueAsNumber;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tool_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Takım Sayısı</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Takım sayısı"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : e.target.valueAsNumber;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nc_control_unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NC Kontrol Ünitesi</FormLabel>
                  <FormControl>
                    <Input placeholder="Kontrol ünitesi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Diğer Bilgiler</h3>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="manufacturing_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Üretim Yılı</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      value={
                        field.value
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : undefined;
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="machine_weight_kg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Makine Ağırlığı (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Makine ağırlığı"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : e.target.valueAsNumber;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_part_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maksimum Parça Boyutu</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: 500x300x200 mm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maintenance_interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bakım Aralığı (Gün)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Bakım aralığı"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : e.target.valueAsNumber;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
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
                    <Input placeholder="Açıklama girin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
          <Button type="submit">Kaydet</Button>
        </div>
      </form>
    </Form>
  );
}
