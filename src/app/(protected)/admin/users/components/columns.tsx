"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useDeleteUser } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(value) => table.toggleAllRowsSelected()}
        className="h-4 w-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.getToggleSelectedHandler()}
        className="h-4 w-4"
      />
    ),
  },
  {
    accessorKey: "username",
    header: "İsim",
    cell: ({ row }) => {
      const username = row.getValue("username") as string;
      return <div className="font-medium">{username}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "E-posta",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <div className="text-muted-foreground">{email}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge
          variant={
            role === "ADMIN"
              ? "destructive"
              : role === "MANAGER"
              ? "default"
              : "secondary"
          }
        >
          {role}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "is_active",
    header: "Durum",
    cell: ({ row }) => {
      const is_active = row.getValue("is_active") as boolean;
      return (
        <Badge
          variant={is_active ? "default" : "destructive"}
          className={is_active ? "bg-green-500 text-white" : ""}
        >
          {is_active ? "Aktif" : "Pasif"}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => {
      const user = row.original;
      const deleteUser = useDeleteUser();
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/admin/users/${user.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Düzenle
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (
                  window.confirm(
                    "Bu kullanıcıyı silmek istediğinizden emin misiniz?"
                  )
                ) {
                  deleteUser.mutate({ id: user.id } as User);
                }
              }}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
