"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pen, Trash } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/column-header";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Machine,
  MachineType,
  MachineStatus,
  AxisCount,
} from "@/types/manufacture";
import Link from "next/link";
import { useDeleteMachine } from "@/hooks/useMachines";
import { Checkbox } from "@/components/ui/checkbox";

export const machinesColumns: ColumnDef<Machine>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center items-center pl-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center pl-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "machine_code",
    accessorKey: "machine_code",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Makine Kodu"
        className="text-center justify-center pl-2"
      />
    ),
    cell: ({ row }) => {
      const machineCode = row.getValue<string>("machine_code");
      return (
        <div className="flex justify-center items-center pl-2">
          {machineCode ? machineCode : "-"}
        </div>
      );
    },
  },
  {
    id: "machine_type",
    accessorKey: "machine_type",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Makine Tipi"
        className="text-center justify-center"
      />
    ),
  },
  {
    id: "brand",
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Marka"
        className="text-center justify-center"
      />
    ),
  },
  {
    id: "model",
    accessorKey: "model",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Model"
        className="text-center justify-center"
      />
    ),
  },
  {
    id: "axis_count",
    accessorKey: "axis_count",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Eksen Sayısı"
        className="text-center justify-center"
      />
    ),
    cell: ({ row }) => {
      const axisCount = row.getValue<string>("axis_count");
      const normalizedCount = axisCount.replace(/\s/g, ""); // Remove any existing spaces

      const axisCountMap: Record<string, string> = {
        "9EKSEN": "9 Eksen",
        "8.5EKSEN": "8.5 Eksen",
        "5EKSEN": "5 Eksen",
        "4EKSEN": "4 Eksen",
        "3EKSEN": "3 Eksen",
        "2EKSEN": "2 Eksen",
        "1EKSEN": "1 Eksen",
      };

      return axisCountMap[normalizedCount] || "-";
    },
  },
  {
    id: "maintenance_interval",
    accessorKey: "maintenance_interval",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Bakım Aralığı (Gün)"
        className="text-center justify-center"
      />
    ),
    cell: ({ row }) => {
      const interval = row.getValue<number>("maintenance_interval");
      return interval || 180;
    },
  },
  {
    id: "last_maintenance_date",
    accessorKey: "last_maintenance_date",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Son Bakım Tarihi"
        className="text-center justify-center"
      />
    ),
    cell: ({ row }) => {
      const date = row.getValue<Date>("last_maintenance_date");
      return date ? date.toLocaleDateString("tr-TR") : "Planlanmadı";
    },
  },
  {
    id: "next_maintenance_date",
    accessorKey: "next_maintenance_date",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sonraki Bakım Tarihi"
        className="text-center justify-center"
      />
    ),
    cell: ({ row }) => {
      const date = row.getValue<Date>("next_maintenance_date");
      return date ? date.toLocaleDateString("tr-TR") : "Planlanmadı";
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Durum"
        className="text-center justify-center"
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as MachineStatus;
      return status === "AVAILABLE"
        ? "Müsait"
        : status === "IN_USE"
        ? "Kullanımda"
        : status === "MAINTENANCE"
        ? "Bakımda"
        : "Emekli";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteMachine = useDeleteMachine();

      return (
        <div className="flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/maintanence/machines/${row.original.id}`}
                  className="flex items-center"
                >
                  <Pen className="mr-2 h-4 w-4" />
                  Düzenle
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 flex items-center justify-center"
                onClick={() => {
                  if (confirm("Makineyi silmek istediğinize emin misiniz?")) {
                    deleteMachine.mutate(row.original.id || "");
                  }
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Sil</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
