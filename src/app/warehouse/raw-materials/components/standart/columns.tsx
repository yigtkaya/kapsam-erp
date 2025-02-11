"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pen, Trash } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/column-header";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/types/inventory";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const standardPartsColumns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="pl-4">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4">
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
    id: "product_code",
    accessorFn: (row: Product) => row.product_code,
    header: ({ column }) => (
      <div className="pl-2">
        <DataTableColumnHeader column={column} title="Ürün Kodu" />
      </div>
    ),
    cell: ({ row }) => row.original.product_code,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "product_name",
    accessorFn: (row: Product) => row.product_name,
    header: ({ column }) => (
      <div className="pl-2">
        <DataTableColumnHeader column={column} title="Ürün Adı" />
      </div>
    ),
    cell: ({ row }) => row.original.product_name,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "current_stock",
    accessorFn: (row: Product) => row.current_stock,
    header: ({ column }) => (
      <div className="pl-2">
        <DataTableColumnHeader column={column} title="Stok Miktarı" />
      </div>
    ),
    cell: ({ row }) => row.original.current_stock,
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/warehouse/raw-materials/standard/${row.original.id}`}
                  className="flex items-center"
                >
                  <Pen className="mr-2 h-4 w-4" />
                  <span>Düzenle</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                <span>Sil</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
