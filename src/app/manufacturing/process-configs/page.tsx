import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProcessConfigsDataTable } from "./components/process-configs-table";

export const metadata: Metadata = {
    title: "Process Configurations | Manufacturing | Kapsam ERP",
    description: "Process configuration management for manufacturing processes",
};

export default async function ProcessConfigsPage() {
    return (
        <div className="container py-4">
            <div className="flex justify-between items-center">
                <PageHeader
                    title="İşlem Yapılandırmaları"
                    description="Üretim süreçleri için işlem yapılandırmalarını yönetin"
                />
                <Link href="/manufacturing/process-configs/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Yapılandırma
                    </Button>
                </Link>
            </div>
            <div className="mt-6">
                <ProcessConfigsDataTable />
            </div>
        </div>
    );
} 