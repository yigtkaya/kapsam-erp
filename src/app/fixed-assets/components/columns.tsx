"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Machine, MachineStatus } from "@/types/manufacture";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableRowActions } from "./data-table-row-actions";
import {
  Settings2,
  Tag,
  AlertTriangle,
  Wrench,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { needsMaintenance } from "@/types/manufacture";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: any; // Replace with proper type if available
  title: string;
  className?: string;
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export const columns: ColumnDef<Machine>[] = [
  {
    accessorKey: "machine_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Demirbaş Kodu" />
    ),
    cell: ({ row }) => {
      const machine = row.original;
      const requiresMaintenance = needsMaintenance(machine);

      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/fixed-assets/${machine.id}`}
            className="hover:underline font-medium"
          >
            {machine.machine_code}
          </Link>
          {requiresMaintenance && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Bakım
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "machine_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Makine Tipi" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="flex w-fit items-center gap-1">
          <Settings2 className="h-3 w-3" />
          {row.original.machine_type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Durum" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === MachineStatus.AVAILABLE
              ? "default"
              : status === MachineStatus.MAINTENANCE
              ? "destructive"
              : "secondary"
          }
          className="flex w-fit items-center gap-1"
        >
          <Tag className="h-3 w-3" />
          {status === MachineStatus.AVAILABLE
            ? "Müsait"
            : status === MachineStatus.MAINTENANCE
            ? "Bakımda"
            : "Kullanımda"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marka/Model" />
    ),
    cell: ({ row }) => {
      const machine = row.original;
      return (
        <div>
          {machine.brand}
          {machine.model && (
            <span className="text-muted-foreground"> / {machine.model}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "last_maintenance_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Son Bakım" />
    ),
    cell: ({ row }) => {
      const date = row.original.last_maintenance_date;
      if (!date) return null;

      return (
        <div className="flex items-center gap-2 text-sm">
          <Wrench className="h-3 w-3" />
          {new Date(date).toLocaleDateString("tr-TR")}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Açıklama" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[300px]">
          <span className="line-clamp-2">
            {row.original.description || "Açıklama bulunmuyor"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
