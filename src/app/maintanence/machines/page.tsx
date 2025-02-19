"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import MachinesDataTable from "./components/machines-data-table";

export default function MachinesPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Makine Yönetimi</h1>
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
