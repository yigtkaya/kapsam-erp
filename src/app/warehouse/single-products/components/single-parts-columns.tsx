"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/inventory";
import { Link, MoreHorizontal } from "lucide-react";
import { Pen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeleteProduct } from "@/hooks/useProducts";
// ... reuse similar column definitions from finishedProductsColumns...
// Modify to match single part fields

export const singlePartsColumns: ColumnDef<Product>[] = [
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
    accessorFn: (row) => row.product_code,
    header: "Ürün Kodu",
    // ... same cell formatting ...
  },
  {
    id: "product_name",
    accessorFn: (row) => row.product_name,
    header: "Ürün Adı",
  },
  // Remove technical_drawing column if not needed
  {
    id: "current_stock",
    accessorFn: (row) => row.current_stock,
    header: "Stok Miktarı",
  },
  // ... keep actions column ...
  {
    id: "actions",
    header: "İşlemler",
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
                  href={`/warehouse/finished-products/${row.original.id}`}
                  className="flex items-center justify-center"
                >
                  <Pen className="mr-2 h-4 w-4" />
                  <span>Düzenle</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 flex items-center justify-center"
                onClick={() => {
                  const confirm = window.confirm(
                    "Bu ürünü silmek istediğinize emin misiniz?"
                  );
                  if (confirm) {
                    deleteProduct.mutate(row.original.id.toString());
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
