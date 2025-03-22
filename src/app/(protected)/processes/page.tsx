import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProcessesDataTable } from "./components/processes-data-table";

export const metadata: Metadata = {
  title: "Manufacturing Processes | Kapsam ERP",
  description: "Manufacturing process management",
};

export default function ProcessesPage() {
  return (
    <div className="container py-4">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Üretim Süreçleri"
          description="Standart üretim süreçlerini tanımlayın ve düzenleyin"
          showBackButton
        />
        <Link href="/manufacturing/processes/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Süreç
          </Button>
        </Link>
      </div>
      <ProcessesDataTable />
    </div>
  );
}
