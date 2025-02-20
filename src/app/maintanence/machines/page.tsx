"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import MachinesDataTable from "./components/machines-data-table";
import { PageHeader } from "@/components/ui/page-header";

export default function MachinesPage() {
  return (
    <div className="container py-4">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Makine Yönetimi"
          description="Makine Listesi"
          showBackButton
        />
        <Button asChild>
          <Link href="/maintanence/machines/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Makine Ekle
          </Link>
        </Button>
      </div>
      <MachinesDataTable />
    </div>
  );
}
