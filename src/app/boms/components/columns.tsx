"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BOM } from "@/types/manufacture";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { DataTableColumnHeader } from "@/components/ui/column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useDeleteBOM } from "@/hooks/useBOMs";

export const columns: ColumnDef<BOM>[] = [
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
      <div
        className="flex justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Reçete Numarası"
        className="text-left"
      />
    ),
    cell: ({ row }) => <div className="text-left">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Ürün"
        className="text-left"
      />
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("product")}</div>
    ),
  },
  {
    accessorKey: "version",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Versiyon"
        className="text-left"
      />
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("version")}</div>
    ),
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Durum"
        className="text-left"
      />
    ),
    cell: ({ row }) => (
      <div
        className={`text-left font-medium ${
          row.original.is_active ? "text-green-600" : "text-red-600"
        }`}
      >
        {row.original.is_active ? "Active" : "Inactive"}
      </div>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="İşlemler"
        className="text-right"
      />
    ),
    cell: ({ row }) => {
      const { mutate: deleteBOM } = useDeleteBOM();
      const bom = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        const confirm = window.confirm(
          "Bu reçeteyi silmek istediğinize emin misiniz?"
        );
        if (confirm) {
          try {
            deleteBOM(bom.id);
            toast.success("Reçete başarıyla silindi");
            router.refresh();
          } catch (error) {
            toast.error("Reçeteyi silmekte sorun çıktı");
          }
        }
      };

      return (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/boms/details/${bom.id}`}
                  className="flex items-center"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Düzenle
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                <Trash className="mr-2 h-4 w-4" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
