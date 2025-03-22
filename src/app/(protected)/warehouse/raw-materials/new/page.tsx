"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  useCreateRawMaterial,
  useUnitOfMeasures,
} from "@/hooks/useRawMaterials";
import { RawMaterial } from "@/types/inventory";

// Define the Zod schema for the form
const materialSchema = z.object({
  material_code: z.string().nonempty("Malzeme/Parça kodu zorunludur"),
  material_name: z.string().nonempty("Malzeme/Parça adı zorunludur"),
  current_stock: z.preprocess(
    (a) => Number(a),
    z.number().min(0, "Mevcut stok negatif olamaz")
  ),
  unit: z.object({
    id: z.number().optional().default(0),
    unit_code: z.string().min(1, "Birim kodu zorunludur"),
    unit_name: z.string().min(1, "Birim adı zorunludur"),
  }),
  inventory_category: z
    .object({
      id: z.number(),
      name: z.string(),
      description: z.string().optional(),
    })
    .optional(),
  material_type: z.enum(["STEEL", "ALUMINUM"]),
  width: z.preprocess((a) => {
    const parsed = Number(a);
    return isNaN(parsed) ? null : parsed;
  }, z.number().min(0, "Genişlik pozitif olmalıdır").nullable().optional()),
  height: z.preprocess((a) => {
    const parsed = Number(a);
    return isNaN(parsed) ? null : parsed;
  }, z.number().min(0, "Yükseklik pozitif olmalıdır").nullable().optional()),
  thickness: z.preprocess((a) => {
    const parsed = Number(a);
    return isNaN(parsed) ? null : parsed;
  }, z.number().min(0, "Kalınlık pozitif olmalıdır").nullable().optional()),
  diameter_mm: z.preprocess((a) => {
    const parsed = Number(a);
    return isNaN(parsed) ? null : parsed;
  }, z.number().min(0, "Çap pozitif olmalıdır").nullable().optional()),
});

type MaterialFormData = z.infer<typeof materialSchema>;

export default function NewMaterialPage() {
  const router = useRouter();
  const createRawMaterial = useCreateRawMaterial();
  const { data: unitOfMeasures } = useUnitOfMeasures();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "raw"; // 'raw' or 'standard'
  const isStandard = type === "standard";

  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      material_code: "",
      material_name: "",
      current_stock: 0,
      material_type: "STEEL",
      width: null,
      height: null,
      thickness: null,
      diameter_mm: null,
      unit: {
        id: 0,
        unit_code: "",
        unit_name: "",
      },
    },
  });

  // If the list of units is loaded and no valid unit is yet selected,
  // preselect the first available unit.
  useEffect(() => {
    if (unitOfMeasures?.length && form.getValues("unit").id === 0) {
      form.setValue("unit", unitOfMeasures[0]);
    }
  }, [unitOfMeasures, form]);

  async function onSubmit(values: z.infer<typeof materialSchema>) {
    try {
      const payload = {
        ...values,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        inventory_category: "HAMMADDE",
      };

      await createRawMaterial.mutateAsync(payload as unknown as RawMaterial);
      toast.success("Hammadde başarıyla oluşturuldu");
      router.back();
    } catch (error) {
      toast.error("Hammadde oluşturulurken bir hata oluştu");
      console.error(error);
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">
        {isStandard ? "Yeni Standart Parça Ekle" : "Yeni Hammadde Ekle"}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium mb-2">Temel Bilgiler</h3>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="material_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isStandard ? "Parça Kodu" : "Malzeme Kodu"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${
                          isStandard ? "Parça" : "Malzeme"
                        } kodunu girin`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="material_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isStandard ? "Parça Adı" : "Malzeme Adı"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${
                          isStandard ? "Parça" : "Malzeme"
                        } adını girin`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="current_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mevcut Stok</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isStandard && (
                <FormField
                  control={form.control}
                  name="material_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Malzeme Tipi</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Malzeme tipini seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="STEEL">Çelik</SelectItem>
                          <SelectItem value="ALUMINUM">Alüminyum</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* Unit Selection */}
          <div>
            <h3 className="text-lg font-medium mb-2">Birim Seçimi</h3>
            <Separator className="mb-4" />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birim</FormLabel>
                  <Select
                    onValueChange={(value: string) => {
                      const selectedUnit = unitOfMeasures?.find(
                        (unit) => String(unit.id) === value
                      );
                      if (selectedUnit) {
                        field.onChange(selectedUnit);
                      }
                    }}
                    value={
                      field.value && field.value.id !== 0
                        ? String(field.value.id)
                        : ""
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Birim seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitOfMeasures?.map((unit) => (
                        <SelectItem key={unit.id} value={String(unit.id)}>
                          {unit.unit_name} ({unit.unit_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dimensions */}
          <div>
            <h3 className="text-lg font-medium mb-2">
              Boyutlar (İsteğe bağlı)
            </h3>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genişlik</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Genişlik"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yükseklik</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Yükseklik"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thickness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kalınlık</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Kalınlık"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diameter_mm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Çap (mm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Çap"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Oluşturuluyor..."
              : isStandard
              ? "Standart Parça Oluştur"
              : "Hammadde Oluştur"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
