import { Metadata } from "next";
import { BOMsDataTable } from "./components/boms-data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "BOMs | Kapsam ERP",
  description: "Bill of Materials management",
};

export default async function BOMsPage() {
  return (
    <div className="container py-4">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Ürün Reçeteleri"
          description="Ürün reçetelerini yönetin ve onların bileşenlerini düzenleyin"
          showBackButton
        />
        <Link href="/boms/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Ürün Reçetesi
          </Button>
        </Link>
      </div>
      <BOMsDataTable />
    </div>
  );
}
