"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BOMProcessConfig } from "@/types/manufacture";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { DataTableColumnHeader } from "@/components/ui/column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useDeleteProcessConfig } from "@/hooks/useProcessConfig";


export const columns: ColumnDef<BOMProcessConfig>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex justify-center items-center">
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div
                className="flex justify-center items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
    },
    {
        accessorKey: "process",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="İşlem Id"
                className="text-left"
            />
        ),
        cell: ({ row }) => (
            <div className="text-left font-medium">
                {row.getValue("process")}
            </div>
        ),
    },
    {
        accessorKey: "axis_count",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Eksen Sayısı"
                className="text-left"
            />
        ),
        cell: ({ row }) => (
            <div className="text-left">{row.getValue("machine_type")}</div>
        ),
    },
    {
        accessorKey: "estimated_duration_minutes",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Tahmini Süre"
                className="text-left"
            />
        ),
        cell: ({ row }) => (
            <div className="text-left">{row.getValue("estimated_duration_minutes") || "-"}</div>
        ),
    },
    {
        accessorKey: "tooling_requirements",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Araç Gereksinimleri"
                className="text-left"
            />
        ),
        cell: ({ row }) => (
            <div className="text-left">{row.getValue("tooling_requirements") || "-"}</div>
        ),
    },
    {
        accessorKey: "quality_checks",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Kalite Kontrolleri"
                className="text-left"
            />
        ),
        cell: ({ row }) => {
            const date = row.getValue("next_maintenance_date") as string | undefined;
            return (
                <div className="text-left">
                    {date ? new Date(date).toLocaleDateString("tr-TR") : "-"}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="İşlemler"
                className="text-right"
            />
        ),
        cell: ({ row }) => {
            const { mutate: deleteProcessConfig } = useDeleteProcessConfig();
            const processConfig = row.original;
            const router = useRouter();

            const handleDelete = async () => {
                const confirm = window.confirm(
                    "Bu makineyi silmek istediğinize emin misiniz?"
                );
                if (confirm) {
                    try {
                        deleteProcessConfig(processConfig.id);
                        toast.success("İşlem yapılandırması başarıyla silindi");
                        router.refresh();
                    } catch (error) {
                        toast.error("İşlem yapılandırmasını silmekte sorun çıktı");
                    }
                }
            };

            return (
                <div className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/manufacturing/process-configs/details/${processConfig.id}`}
                                    className="flex items-center"
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Düzenle
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                                <Trash className="mr-2 h-4 w-4" />
                                Sil
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
