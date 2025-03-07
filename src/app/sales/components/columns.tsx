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
      <div className="flex w-full min-w-[100px] px-4">
        <DataTableColumnHeader column={column} title="Sipariş No" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-full min-w-[100px] px-4">
          <span className="font-medium">{row.getValue("order_number")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "customer_name",
    header: ({ column }) => (
      <div className="flex w-full min-w-[180px] px-4">
        <DataTableColumnHeader column={column} title="Müşteri" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-full min-w-[180px] px-4">
          <span className="font-medium">{row.getValue("customer_name")}</span>
        </div>
      );
    },
  },
  {
    id: "product_codes",
    header: ({ column }) => (
      <div className="flex w-full min-w-[200px] px-4">
        <DataTableColumnHeader column={column} title="Ürün Kodları" />
      </div>
    ),
    cell: ({ row }) => {
      const items = row.original.items || [];
      const productCodes = items
        .map((item) => item.product_details?.product_code)
        .filter(Boolean)
        .join(", ");
      return (
        <div className="flex w-full min-w-[200px] px-4">
          <span className="font-medium truncate" title={productCodes}>
            {productCodes}
          </span>
        </div>
      );
    },
  },
  {
    id: "multicodes",
    header: ({ column }) => (
      <div className="flex w-full min-w-[200px] px-4">
        <DataTableColumnHeader column={column} title="Multicode" />
      </div>
    ),
    cell: ({ row }) => {
      const items = row.original.items || [];
      const multicodes = items
        .map((item) => item.product_details?.multicode)
        .filter(Boolean)
        .join(", ");
      return (
        <div className="flex w-full min-w-[200px] px-4">
          <span className="font-medium truncate" title={multicodes}>
            {multicodes}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "order_date",
    header: ({ column }) => (
      <div className="flex w-full min-w-[120px] px-4">
        <DataTableColumnHeader column={column} title="Sipariş Tarihi" />
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("order_date"));
      return (
        <div className="flex w-full min-w-[120px] px-4">
          <span className="font-medium tabular-nums">
            {date.toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "order_receiving_date",
    header: ({ column }) => (
      <div className="flex w-full min-w-[120px] px-4">
        <DataTableColumnHeader column={column} title="Sipariş Alım Tarihi" />
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("order_receiving_date"));
      return (
        <div className="flex w-full min-w-[120px] px-4">
          <span className="font-medium tabular-nums">
            {date.toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "deadline_date",
    header: ({ column }) => (
      <div className="flex w-full min-w-[120px] px-4">
        <DataTableColumnHeader column={column} title="Termin Tarihi" />
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("deadline_date"));
      return (
        <div className="flex w-full min-w-[120px] px-4">
          <span className="font-medium tabular-nums">
            {date.toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "kapsam_deadline_date",
    header: ({ column }) => (
      <div className="flex w-full min-w-[120px] px-4">
        <DataTableColumnHeader column={column} title="Kapsam Termin Tarihi" />
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("kapsam_deadline_date"));
      return (
        <div className="flex w-full min-w-[120px] px-4">
          <span className="font-medium tabular-nums">
            {date.toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="flex w-full min-w-[100px] px-4">
        <DataTableColumnHeader column={column} title="Durum" />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusDisplay = row.original.status_display;

      return (
        <div className="flex w-full min-w-[100px] px-4 items-center">
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
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <div className="flex w-[80px] justify-end px-4">
        <span className="sr-only">Actions</span>
      </div>
    ),
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex w-[80px] justify-end px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/sales/${order.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
