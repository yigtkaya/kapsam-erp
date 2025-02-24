import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MachinesDataTable } from "./components/machines-data-table";

export const metadata: Metadata = {
  title: "Machines | Kapsam ERP",
  description: "Machine management",
};

export default function MachinesPage() {
  return (
    <div className="container py-4">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Makineler"
          description="Üretim makinelerini yönetin ve bakım planlaması yapın"
          showBackButton
        />
        <Link href="/manufacturing/machines/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Makine
          </Button>
        </Link>
      </div>
      <MachinesDataTable />
    </div>
  );
}
