import { ColumnDef } from "@tanstack/react-table";
import { BOM } from "@/types/manufacture";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const columns: ColumnDef<BOM>[] = [
  {
    header: "Ürün Adı",
    accessorKey: "product.product_name",
    cell: ({ row }) => row.original.product?.product_name || "İsimsiz Ürün",
  },
  {
    header: "Versiyon",
    accessorKey: "version",
  },
  {
    header: "Durum",
    accessorKey: "is_active",
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "default" : "secondary"}>
        {row.original.is_active ? "Aktif" : "Pasif"}
      </Badge>
    ),
  },
  {
    header: "Onaylayan",
    accessorKey: "approved_by",
    cell: ({ row }) =>
      row.original.approved_by
        ? `${row.original.approved_by.first_name} ${row.original.approved_by.last_name}`
        : "-",
  },
  {
    header: "Onay Tarihi",
    accessorKey: "approved_at",
    cell: ({ row }) =>
      row.original.approved_at
        ? format(new Date(row.original.approved_at), "d MMMM yyyy", {
            locale: tr,
          })
        : "-",
  },
];
