import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProcessConfigForm } from "../components/process-config-form";
import { fetchProcesses } from "@/api/manufacturing";

export const metadata: Metadata = {
    title: "New Process Configuration | Manufacturing | Kapsam ERP",
    description: "Create a new process configuration",
};

export default async function NewProcessConfigPage() {
    const processes = await fetchProcesses();

    return (
        <div className="container py-4">
            <PageHeader
                title="Yeni İşlem Yapılandırması"
                description="Yeni bir işlem yapılandırması oluşturun"
                showBackButton
            />
            <div className="mt-6">
                <ProcessConfigForm processes={processes} />
            </div>
        </div>
    );
}
