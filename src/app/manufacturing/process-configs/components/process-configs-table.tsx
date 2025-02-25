"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { BOMProcessConfig, ManufacturingProcess } from "@/types/manufacture";
import Link from "next/link";
import { useProcessConfigs, useDeleteProcessConfig } from "@/hooks/useProcessConfig";
import { toast } from "sonner";

export function ProcessConfigsDataTable() {
    const { data: configs = [], isLoading } = useProcessConfigs();
    const deleteConfig = useDeleteProcessConfig();

    const handleDelete = async (id: number) => {
        try {
            await deleteConfig.mutateAsync(id);
            toast.success("İşlem yapılandırması başarıyla silindi");
        } catch (error) {
            toast.error("İşlem yapılandırması silinirken bir hata oluştu");
            console.error("Error deleting process config:", error);
        }
    };

    if (isLoading) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Süreç</TableHead>
                        <TableHead>Eksen Sayısı</TableHead>
                        <TableHead>Tahmini Süre (dk)</TableHead>
                        <TableHead>Takım Gereksinimleri</TableHead>
                        <TableHead>Kalite Kontrolleri</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {configs.map((config) => (
                        <TableRow key={config.id}>
                            <TableCell>{config.id}</TableCell>
                            <TableCell>
                                {(config.process as unknown as ManufacturingProcess).process_name}
                            </TableCell>
                            <TableCell>{config.axis_count || "Belirtilmemiş"}</TableCell>
                            <TableCell>{config.estimated_duration_minutes || "-"}</TableCell>
                            <TableCell>
                                {config.tooling_requirements
                                    ? Object.keys(config.tooling_requirements).length
                                    : "-"}
                            </TableCell>
                            <TableCell>
                                {config.quality_checks
                                    ? Object.keys(config.quality_checks).length
                                    : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Menüyü aç</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <Link
                                            href={`/manufacturing/process-configs/${config.id}`}
                                            passHref
                                        >
                                            <DropdownMenuItem>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Düzenle
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() => handleDelete(config.id)}
                                        >
                                            <Trash className="mr-2 h-4 w-4" />
                                            Sil
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {configs.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                Henüz yapılandırma bulunmuyor
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
} 