import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { BOMsDataTable } from "./components/boms-data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Reçeteler | Kapsam ERP",
  description: "Ürün reçetelerini yönetin",
};

export default function BOMsPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Reçeteler"
        description="Ürün reçetelerini görüntüleyin ve yönetin"
        action={
          <Link href="/boms/new">
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              Yeni Reçete
            </Button>
          </Link>
        }
      />
      <div className="mt-6">
        <BOMsDataTable />
      </div>
    </div>
  );
}
