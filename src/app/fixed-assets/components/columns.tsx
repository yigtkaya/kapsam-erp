"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Machine, MachineStatus, MachineType } from "@/types/manufacture";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnHeader } from "@/components/column-header";

export const columns: ColumnDef<Machine>[] = [
  {
    accessorKey: "machine_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Demirbaş Kodu" />
    ),
  },
  {
    accessorKey: "machine_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Makine Tipi" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("machine_type") as MachineType;
      return <div>{type}</div>;
    },
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marka" />
    ),
  },
  {
    accessorKey: "model",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Durum" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as MachineStatus;
      return (
        <Badge
          variant={
            status === "AVAILABLE"
              ? "default"
              : status === "MAINTENANCE"
              ? "secondary"
              : "default"
          }
        >
          {status === "AVAILABLE"
            ? "Müsait"
            : status === "IN_USE"
            ? "Kullanımda"
            : "Bakımda"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "manufacturing_year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Üretim Yılı" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
