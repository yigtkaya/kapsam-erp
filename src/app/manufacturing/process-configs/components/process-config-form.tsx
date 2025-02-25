"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AxisCount, BOMProcessConfig, ManufacturingProcess } from "@/types/manufacture";
import { useCreateProcessConfig, useUpdateProcessConfig } from "@/hooks/useProcessConfig";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const processConfigSchema = z.object({
    process: z.number(),
    axis_count: z.nativeEnum(AxisCount).optional(),
    estimated_duration_minutes: z.number().min(0).optional(),
    tooling_requirements: z.record(z.string(), z.any()).optional(),
    quality_checks: z.record(z.string(), z.any()).optional(),
});

type ProcessConfigFormData = z.infer<typeof processConfigSchema>;

interface ProcessConfigFormProps {
    initialData?: Partial<BOMProcessConfig>;
    processes?: ManufacturingProcess[];
}

export function ProcessConfigForm({
    initialData,
    processes = [],
}: ProcessConfigFormProps) {
    const router = useRouter();
    const createConfig = useCreateProcessConfig();
    const updateConfig = useUpdateProcessConfig();

    const form = useForm<ProcessConfigFormData>({
        resolver: zodResolver(processConfigSchema),
        defaultValues: {
            process: initialData?.process || undefined,
            axis_count: initialData?.axis_count,
            estimated_duration_minutes: initialData?.estimated_duration_minutes,
            tooling_requirements: initialData?.tooling_requirements || {},
            quality_checks: initialData?.quality_checks || {},
        },
    });

    const handleSubmit = async (data: ProcessConfigFormData) => {
        try {
            if (initialData?.id) {
                await updateConfig.mutateAsync({
                    id: initialData.id,
                    data: {
                        ...data,
                        id: initialData.id,
                    },
                });
                toast.success("İşlem yapılandırması başarıyla güncellendi");
            } else {
                await createConfig.mutateAsync(data);
                toast.success("İşlem yapılandırması başarıyla oluşturuldu");
            }
            router.push("/manufacturing/process-configs");
            router.refresh();
        } catch (error) {
            toast.error("İşlem yapılandırması kaydedilirken bir hata oluştu");
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="process"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Süreç</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(parseInt(value, 10))}
                                value={field.value?.toString()}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Süreç seçin" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {processes.map((process) => (
                                        <SelectItem
                                            key={process.id}
                                            value={process.id.toString()}
                                        >
                                            {process.process_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Yapılandırmanın uygulanacağı üretim sürecini seçin
                            </FormDescription>
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
                                value={field.value}
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
                            <FormDescription>
                                İşlem için gerekli eksen sayısını seçin
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="estimated_duration_minutes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tahmini Süre (dakika)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)
                                    }
                                />
                            </FormControl>
                            <FormDescription>
                                İşlemin tahmini süresini dakika cinsinden girin
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tooling_requirements"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Takım Gereksinimleri</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Takım gereksinimlerini JSON formatında girin"
                                    {...field}
                                    value={JSON.stringify(field.value, null, 2)}
                                    onChange={(e) => {
                                        try {
                                            const parsed = JSON.parse(e.target.value);
                                            field.onChange(parsed);
                                        } catch {
                                            // Invalid JSON, keep the text as is
                                            field.onChange(e.target.value);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Gerekli takımları ve özelliklerini JSON formatında belirtin
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="quality_checks"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kalite Kontrolleri</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Kalite kontrollerini JSON formatında girin"
                                    {...field}
                                    value={JSON.stringify(field.value, null, 2)}
                                    onChange={(e) => {
                                        try {
                                            const parsed = JSON.parse(e.target.value);
                                            field.onChange(parsed);
                                        } catch {
                                            // Invalid JSON, keep the text as is
                                            field.onChange(e.target.value);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Kalite kontrol noktalarını ve kriterlerini JSON formatında belirtin
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={createConfig.isPending || updateConfig.isPending}>
                    {createConfig.isPending || updateConfig.isPending ? "Kaydediliyor..." : "Kaydet"}
                </Button>
            </form>
        </Form>
    );
} 