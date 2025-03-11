import { ColumnDef } from "@tanstack/react-table";
import { WorkflowProcess } from "@/types/manufacture";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<WorkflowProcess>[] = [
  {
    accessorKey: "stock_code",
    header: "Stok Kodu",
  },
  {
    accessorKey: "product_details.product_name",
    header: "Ürün",
    cell: ({ row }) => row.original.product_details?.product_name || "N/A",
  },
  {
    accessorKey: "product_details.product_code",
    header: "Ürün Kodu",
    cell: ({ row }) => row.original.product_details?.product_code || "N/A",
  },
  {
    accessorKey: "process_details.process_name",
    header: "Proses",
    cell: ({ row }) => row.original.process_details?.process_name || "N/A",
  },
  {
    accessorKey: "sequence_order",
    header: "Sıra",
    cell: ({ row }) => <Badge>{row.original.sequence_order}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <Button
          variant="ghost"
          onClick={() => router.push(`/workflow-cards/${row.original.id}`)}
        >
          Detayları Gör
        </Button>
      );
    },
  },
];
