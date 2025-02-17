"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SalesOrder } from "../types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTableRowActions } from "./row-actions";
import { DataTableColumnHeader } from "@/components/ui/column-header";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<SalesOrder>[] = [
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
      <div className="flex justify-center items-center">
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
    accessorKey: "order_number",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="text-center"
        title="Sipariş Numarası"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.order_number}</div>
    ),
  },
  {
    accessorKey: "customer_name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="text-center"
        title="Müşteri"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.customer_name}</div>
    ),
  },
  {
    accessorKey: "order_date",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="text-center"
        title="Sipariş Tarihi"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {format(new Date(row.original.order_date), "PP")}
      </div>
    ),
  },
  {
    accessorKey: "deadline_date",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="text-center"
        title="Son Teslim Tarihi"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {format(new Date(row.original.deadline_date), "PP")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="text-center"
        title="Durum"
      />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors: Record<string, string> = {
        DRAFT: "bg-gray-100 text-gray-800",
        PENDING_APPROVAL: "bg-orange-100 text-orange-800",
        APPROVED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
        COMPLETED: "bg-purple-100 text-purple-800",
      };

      return (
        <div className="text-center">
          <Badge
            className={`${statusColors[status]} px-2 py-1 rounded-full text-sm font-medium transition-none`}
          >
            {status.replace("_", " ")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "total_shipped_amount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="text-center"
        title="Sevk Edilen Miktar"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.total_shipped_amount}</div>
    ),
  },
  {
    accessorKey: "shipments",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="text-center"
        title="Sevkiyatlar"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.shipments.length}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <DataTableRowActions row={row} />
      </div>
    ),
  },
];
