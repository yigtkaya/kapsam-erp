"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Machine, MachineStatus } from "@/types/manufacture";
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
import { useDeleteMachine } from "@/hooks/useManufacturing";

export const columns: ColumnDef<Machine>[] = [
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
    accessorKey: "machine_code",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Makine Kodu"
        className="text-left"
      />
    ),
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {row.getValue("machine_code")}
      </div>
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
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Marka"
        className="text-left"
      />
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("brand") || "-"}</div>
    ),
  },
  {
    accessorKey: "model",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Model"
        className="text-left"
      />
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("model") || "-"}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Durum"
        className="text-left"
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as MachineStatus;
      return (
        <div
          className={`text-left font-medium ${
            status === "AVAILABLE" ? "text-green-600" : "text-red-600"
          }`}
        >
          {status === "AVAILABLE" ? "Kullanılabilir" : "Kullanılamaz"}
        </div>
      );
    },
  },
  {
    accessorKey: "next_maintenance_date",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sonraki Bakım Tarihi"
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
      const { mutate: deleteMachine } = useDeleteMachine();
      const machine = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        const confirm = window.confirm(
          "Bu makineyi silmek istediğinize emin misiniz?"
        );
        if (confirm) {
          try {
            deleteMachine(machine.id);
            toast.success("Makine başarıyla silindi");
            router.refresh();
          } catch (error) {
            toast.error("Makineyi silmekte sorun çıktı");
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
                  href={`/manufacturing/machines/details/${machine.id}`}
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
