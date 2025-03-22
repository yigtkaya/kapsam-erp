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
import { useDeleteProduct } from "@/hooks/useProducts";

export const standardPartsColumns: ColumnDef<Product>[] = [
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
    id: "product_code",
    accessorFn: (row: Product) => row.product_code,
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Ürün Kodu" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.original.product_code}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "product_name",
    accessorFn: (row: Product) => row.product_name,
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Ürün Adı" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.original.product_name}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "technical_drawing",
    accessorFn: (row: Product) =>
      row.technical_drawings?.find((drawing) => drawing.is_current)
        ?.drawing_code,
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Teknik Çizim Kodu" />
      </div>
    ),
    cell: ({ row }) => {
      const currentDrawing = row.original.technical_drawings?.find(
        (drawing) => drawing.is_current
      );
      return (
        <div className="flex justify-center items-center">
          {currentDrawing && currentDrawing.drawing_url ? (
            <Link
              href={currentDrawing.drawing_url}
              className="hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              {currentDrawing.drawing_code}
            </Link>
          ) : (
            <span>{currentDrawing?.drawing_code ?? "-"}</span>
          )}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
    enableColumnFilter: false,
  },
  {
    id: "current_stock",
    accessorFn: (row: Product) => row.current_stock,
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Stok Miktarı" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.original.current_stock}
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="İşlemler" />
      </div>
    ),
    cell: ({ row }) => {
      const deleteProduct = useDeleteProduct();

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
                  href={`/warehouse/standard-parts/${row.original.id}`}
                  className="flex items-center justify-center"
                >
                  <Pen className="mr-2 h-4 w-4" />
                  <span>Düzenle</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 flex items-center justify-center"
                onClick={() => {
                  if (
                    window.confirm("Ürünü silmek istediğinize emin misiniz?")
                  ) {
                    deleteProduct.mutate(row.original.id);
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
    enableSorting: false,
    enableHiding: false,
  },
];
