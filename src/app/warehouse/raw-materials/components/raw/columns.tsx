"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pen, Trash } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/column-header";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { RawMaterial } from "@/types/inventory";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const rawMaterialsColumns: ColumnDef<RawMaterial>[] = [
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
    id: "material_code",
    accessorFn: (row: RawMaterial) => row.material_code,
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="Malzeme Kodu" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.original.material_code}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "material_name",
    accessorFn: (row: RawMaterial) => row.material_name,
    header: ({ column }) => (
      <div className="pl-2">
        <DataTableColumnHeader column={column} title="Malzeme Adı" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.original.material_name}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "current_stock",
    accessorFn: (row: RawMaterial) => row.current_stock,
    header: ({ column }) => (
      <div className="pl-2">
        <DataTableColumnHeader column={column} title="Stok Miktarı" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.original.current_stock}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "material_type",
    accessorFn: (row: RawMaterial) => row.material_type,
    header: ({ column }) => (
      <div className="pl-2">
        <DataTableColumnHeader column={column} title="Malzeme Tipi" />
      </div>
    ),
    cell: ({ row }) => {
      const type = row.getValue("material_type") as string;
      return type === "STEEL"
        ? "Çelik"
        : type === "ALUMINUM"
        ? "Alüminyum"
        : type;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "width",
    accessorFn: (row: RawMaterial) => row.width,
    header: ({ column }) => (
      <div className="pl-2">
        <DataTableColumnHeader column={column} title="Genişlik" />
      </div>
    ),
    cell: ({ getValue }) => {
      const value = getValue() as number | null;
      return value ? `${value} mm` : "-";
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "height",
    accessorFn: (row: RawMaterial) => row.height,
    header: ({ column }) => (
      <div className="pl-2">
        <DataTableColumnHeader column={column} title="Yükseklik" />
      </div>
    ),
    cell: ({ getValue }) => {
      const value = getValue() as number | null;
      return value ? `${value} mm` : "-";
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "thickness",
    accessorFn: (row: RawMaterial) => row.thickness,
    header: ({ column }) => (
      <div className="pl-2">
        <DataTableColumnHeader column={column} title="Kalınlık" />
      </div>
    ),
    cell: ({ getValue }) => {
      const value = getValue() as number | null;
      return value ? `${value} mm` : "-";
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "diameter_mm",
    accessorFn: (row: RawMaterial) => row.diameter_mm,
    header: ({ column }) => (
      <div className="pl-2">
        <DataTableColumnHeader column={column} title="Çap" />
      </div>
    ),
    cell: ({ getValue }) => {
      const value = getValue() as number | null;
      return value ? `${value} mm` : "-";
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <DataTableColumnHeader column={column} title="İşlemler" />
      </div>
    ),
    cell: ({ row }) => {
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
                  href={`/warehouse/raw-materials/${row.original.id}`}
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
