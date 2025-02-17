"use client";

import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import FinishedProductsDataTable from "./components/finished-products-data-table";

export default function FinishedProductsPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Montajlanmış Ürünler ve Tekil Ürünler
          </h1>
          <p className="text-muted-foreground">
            Montajlanmış ürünleri görüntüleyin ve yönetin
          </p>
        </div>
        <Link href="/warehouse/finished-products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Montajlanmış Ürün Ekle
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
        <FinishedProductsDataTable />
      </Suspense>
    </div>
  );
}
