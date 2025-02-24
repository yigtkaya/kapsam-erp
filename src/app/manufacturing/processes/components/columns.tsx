"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ManufacturingProcess, MachineType } from "@/types/manufacture";
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
import { useDeleteProcess } from "@/hooks/useManufacturing";

export const columns: ColumnDef<ManufacturingProcess>[] = [
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
    accessorKey: "process_code",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Süreç Kodu"
        className="text-left"
      />
    ),
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {row.getValue("process_code")}
      </div>
    ),
  },
  {
    accessorKey: "process_name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Süreç Adı"
        className="text-left"
      />
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("process_name")}</div>
    ),
  },
  {
    accessorKey: "standard_time_minutes",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Standart Süre (dk)"
        className="text-left"
      />
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("standard_time_minutes")}</div>
    ),
  },
  {
    accessorKey: "machine_type",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Makine Tipi"
        className="text-left"
      />
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("machine_type")}</div>
    ),
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
      const { mutate: deleteProcess } = useDeleteProcess();
      const process = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        const confirm = window.confirm(
          "Bu süreci silmek istediğinize emin misiniz?"
        );
        if (confirm) {
          try {
            deleteProcess(process.id);
            toast.success("Süreç başarıyla silindi");
            router.refresh();
          } catch (error) {
            toast.error("Süreci silmekte sorun çıktı");
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
                  href={`/manufacturing/processes/details/${process.id}`}
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
