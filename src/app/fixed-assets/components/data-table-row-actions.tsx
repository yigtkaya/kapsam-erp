"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useDeleteMachine } from "@/hooks/useMachines";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Machine } from "@/types/manufacture";
import { Menu } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const machine = row.original as Machine;
  const router = useRouter();
  const { mutate: deleteMachine } = useDeleteMachine();

  const handleDelete = () => {
    if (window.confirm("Bu demirbaşı silmek istediğinizden emin misiniz?")) {
      deleteMachine(machine.id, {
        onSuccess: () => {
          toast.success("Demirbaş başarıyla silindi");
          router.refresh();
        },
        onError: () => {
          toast.error("Demirbaş silinirken bir hata oluştu");
        },
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Menüyü aç</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Link href={`/fixed-assets/${machine.id}`}>
          <DropdownMenuItem>Düzenle</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
