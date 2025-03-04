"use client";

import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProcessDataTable from "./components/process-data-table";
import { PageHeader } from "@/components/ui/page-header";
export default function ProcessPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <PageHeader
          title="Process Ürünleri"
          description="Process ürünlerini görüntüleyin ve yönetin"
          showBackButton
        />
        {/* <Link href="/warehouse/process/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Process Ürün Ekle
          </Button>
        </Link> */}
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
        <ProcessDataTable />
      </Suspense>
    </div>
  );
}
