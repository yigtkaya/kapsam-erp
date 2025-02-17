"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RawMaterial } from "@/types/inventory";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUpdateRawMaterial, useRawMaterials } from "@/hooks/useRawMaterials";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/api/utils";
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

const formSchema = z.object({
  material_code: z.string().min(1, "Malzeme kodu gerekli"),
  material_name: z.string().min(1, "Malzeme adı gerekli"),
  material_type: z.enum(["STEEL", "ALUMINUM"]),
  width: z.number().nullable(),
  height: z.number().nullable(),
  thickness: z.number().nullable(),
  diameter_mm: z.number().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditRawMaterialFormProps {
  material: RawMaterial;
}

export function EditRawMaterialForm({ material }: EditRawMaterialFormProps) {
  const params = useParams();
  const updateRawMaterial = useUpdateRawMaterial();
  const router = useRouter();
  const { data: rawMaterials, isLoading } = useRawMaterials({});
  const [openMaterialCode, setOpenMaterialCode] = useState(false);
  const [openMaterialName, setOpenMaterialName] = useState(false);

  const materials = rawMaterials?.results ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: material,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateRawMaterial.mutateAsync({
        ...values,
        id: material.id,
      } as unknown as RawMaterial);

      toast.success("Hammadde başarıyla güncellendi");
      router.back();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Hammadde güncellenirken bir hata oluştu");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="material_code"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Malzeme Kodu</FormLabel>
              <Popover
                open={openMaterialCode}
                onOpenChange={setOpenMaterialCode}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      {field.value
                        ? materials.find(
                            (material) => material.material_code === field.value
                          )?.material_code
                        : isLoading
                        ? "Yükleniyor..."
                        : "Malzeme kodu seçin"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Malzeme kodu ara..." />
                      <CommandEmpty>
                        {isLoading
                          ? "Yükleniyor..."
                          : "Malzeme kodu bulunamadı."}
                      </CommandEmpty>
                      <CommandGroup>
                        {materials?.map((material) => (
                          <CommandItem
                            value={material.material_code}
                            key={material.id}
                            onSelect={() => {
                              form.setValue(
                                "material_code",
                                material.material_code
                              );
                              form.setValue(
                                "material_name",
                                material.material_name
                              );
                              setOpenMaterialCode(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                material.material_code === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {material.material_code}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="material_name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Malzeme Adı</FormLabel>
              <Popover
                open={openMaterialName}
                onOpenChange={setOpenMaterialName}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      {field.value
                        ? materials.find(
                            (material) => material.material_name === field.value
                          )?.material_name
                        : isLoading
                        ? "Yükleniyor..."
                        : "Malzeme adı seçin"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Malzeme adı ara..." />
                      <CommandEmpty>
                        {isLoading
                          ? "Yükleniyor..."
                          : "Malzeme adı bulunamadı."}
                      </CommandEmpty>
                      <CommandGroup>
                        {materials?.map((material) => (
                          <CommandItem
                            value={material.material_name}
                            key={material.id}
                            onSelect={() => {
                              form.setValue(
                                "material_name",
                                material.material_name
                              );
                              form.setValue(
                                "material_code",
                                material.material_code
                              );
                              setOpenMaterialName(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                material.material_name === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {material.material_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Malzeme tipi seçin" />
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genişlik (mm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : null
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
                <FormLabel>Yükseklik (mm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : null
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
                <FormLabel>Kalınlık (mm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : null
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
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
