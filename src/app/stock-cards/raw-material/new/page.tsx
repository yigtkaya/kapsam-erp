"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

// UI Components
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Icons
import { Package, Tag, Ruler, Save, ArrowLeft } from "lucide-react";

// Types & Hooks
import { MaterialType, RawMaterial } from "@/types/inventory";
import {
  useCreateRawMaterial,
  useUnitOfMeasures,
} from "@/hooks/useRawMaterials";

// Form validation
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

// Validation schema
const rawMaterialSchema = z.object({
  material_name: z.string().min(1, "Hammadde adı zorunludur"),
  material_code: z.string().min(1, "Hammadde kodu zorunludur"),
  material_type: z.enum(["STEEL", "ALUMINUM"] as const),
  current_stock: z.number().min(0, "Stok miktarı 0'dan küçük olamaz"),
  unit: z.number().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  thickness: z.number().nullable().optional(),
  diameter_mm: z.number().nullable().optional(),
});

type RawMaterialFormValues = z.infer<typeof rawMaterialSchema>;

const defaultValues: Partial<RawMaterialFormValues> = {
  material_type: "STEEL",
  current_stock: 0,
  width: null,
  height: null,
  thickness: null,
  diameter_mm: null,
};

export default function NewRawMaterialPage() {
  const router = useRouter();
  const createMaterial = useCreateRawMaterial();
  const { data: units = [] } = useUnitOfMeasures();

  // Form setup
  const form = useForm<RawMaterialFormValues>({
    resolver: zodResolver(rawMaterialSchema),
    defaultValues,
  });

  const onSubmit = async (data: RawMaterialFormValues) => {
    try {
      const payload = {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        inventory_category: "HAMMADDE",
      };
      await createMaterial.mutateAsync(payload as unknown as RawMaterial);
      toast.success("Hammadde başarıyla oluşturuldu");
      router.push("/stock-cards/raw-material");
    } catch (error) {
      toast.error("Hammadde oluşturulurken bir hata oluştu");
    }
  };

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title="Yeni Hammadde"
        description="Yeni bir hammadde kaydı oluşturun"
        showBackButton
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
              <CardDescription>
                Hammaddenin temel bilgilerini girin
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="material_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hammadde Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Hammadde adı girin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="material_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hammadde Kodu</FormLabel>
                    <FormControl>
                      <Input placeholder="Hammadde kodu girin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="material_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Malzeme Tipi</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Malzeme tipi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STEEL">Çelik</SelectItem>
                          <SelectItem value="ALUMINUM">Alüminyum</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormLabel>Stok Miktarı</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Stok miktarı girin"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birim</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Birim seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem
                              key={unit.id}
                              value={unit.id.toString()}
                            >
                              {unit.unit_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Dimensions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Ölçüler</CardTitle>
              <CardDescription>
                Hammaddenin ölçülerini milimetre cinsinden girin
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genişlik (mm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Genişlik girin"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        value={field.value ?? ""}
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
                    <FormLabel>Yükseklik (mm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Yükseklik girin"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        value={field.value ?? ""}
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
                    <FormLabel>Kalınlık (mm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Kalınlık girin"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        value={field.value ?? ""}
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
                        placeholder="Çap girin"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              İptal
            </Button>
            <Button type="submit" disabled={createMaterial.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
