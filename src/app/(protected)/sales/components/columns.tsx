"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SalesOrderItem } from "@/types/sales";
import { format } from "date-fns";

export const columns: ColumnDef<SalesOrderItem>[] = [
  {
    accessorKey: "sales_order",
    header: () => <div className="text-center">Sipariş No</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.order_number}</div>
    ),
  },
  {
    accessorKey: "product_details.product_code",
    header: () => <div className="text-center">Ürün Kodu</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.product_details?.product_code}
      </div>
    ),
  },
  {
    accessorKey: "product_details.product_name",
    header: () => <div className="text-center">Ürün Adı</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.product_details?.product_name}
      </div>
    ),
  },
  {
    accessorKey: "deadline_date",
    header: () => <div className="text-center">Son Teslim Tarihi</div>,
    cell: ({ row }) => {
      const date = row.original.deadline_date;
      return (
        <div className="text-center">
          {date ? format(new Date(date), "dd.MM.yyyy") : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "kapsam_deadline_date",
    header: () => <div className="text-center">Kapsam Son Teslim Tarihi</div>,
    cell: ({ row }) => {
      const date = row.original.kapsam_deadline_date;
      return (
        <div className="text-center">
          {date ? format(new Date(date), "dd.MM.yyyy") : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "ordered_quantity",
    header: () => <div className="text-center">Sipariş Miktarı</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.ordered_quantity}</div>
    ),
  },
  {
    accessorKey: "fulfilled_quantity",
    header: () => <div className="text-center">Teslim Edilen Miktar</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.fulfilled_quantity}</div>
    ),
  },
  {
    id: "remaining_quantity",
    header: () => <div className="text-center">Kalan Miktar</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.ordered_quantity - row.original.fulfilled_quantity}
      </div>
    ),
  },
];
