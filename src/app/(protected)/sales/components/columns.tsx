"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SalesOrderItem } from "@/types/sales";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<SalesOrderItem>[] = [
  {
    accessorKey: "order_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-gray-800"
        >
          Sipariş No
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.order_number}</div>
    ),
  },
  {
    accessorKey: "product_details.product_code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-gray-800"
        >
          Ürün Kodu
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.product_details?.product_code}
      </div>
    ),
  },
  {
    accessorKey: "product_details.product_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-gray-800"
        >
          Ürün Adı
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.product_details?.product_name}
      </div>
    ),
  },
  {
    accessorKey: "deadline_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-gray-800"
        >
          Son Teslim Tarihi
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-gray-800"
        >
          Kapsam Son Teslim Tarihi
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-gray-800"
        >
          Sipariş Miktarı
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.ordered_quantity}</div>
    ),
  },
  {
    accessorKey: "fulfilled_quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-gray-800"
        >
          Teslim Edilen Miktar
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.fulfilled_quantity}</div>
    ),
  },
  {
    id: "remaining_quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-gray-800"
        >
          Kalan Miktar
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.ordered_quantity - row.original.fulfilled_quantity}
      </div>
    ),
  },
];
