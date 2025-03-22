"use client";

import { UsersDataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { useUsers } from "@/hooks/useUsers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export default function AdminUsersPage() {
  const { data: users, isLoading } = useUsers();

  return (
    <div className="flex flex-col items-center justify-start py-10">
      <div className="w-full">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ekip Üyeleri</h1>
            <p className="text-muted-foreground">
              Ekip üyelerini görüntüleyin ve yönetin
            </p>
          </div>
          <Link href="/admin/users/new">
            <Button>
              <Plus className="h-4 w-4" />
              Ekip Üyesi Ekle
            </Button>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          }
        >
          <UsersDataTable
            data={users || []}
            columns={columns}
            isLoading={isLoading}
          />
        </Suspense>
      </div>
    </div>
  );
}
