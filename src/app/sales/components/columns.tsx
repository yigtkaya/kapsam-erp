"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SalesOrder } from "@/types/sales";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const columns: ColumnDef<SalesOrder>[] = [
  {
    accessorKey: "order_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sipariş No" />
    ),
  },
  {
    accessorKey: "customer_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Müşteri" />
    ),
  },
  {
    accessorKey: "order_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sipariş Tarihi" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("order_date"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "order_receiving_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sipariş Alım Tarihi" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("order_receiving_date"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "deadline_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Termin Tarihi" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("deadline_date"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "kapsam_deadline_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kapsam Termin Tarihi" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("kapsam_deadline_date"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Durum" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusDisplay = row.original.status_display;

      return (
        <Badge
          variant={
            status === "COMPLETED"
              ? "default"
              : status === "CANCELLED"
              ? "destructive"
              : "secondary"
          }
        >
          {statusDisplay}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/sales/${order.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      );
    },
  },
];
