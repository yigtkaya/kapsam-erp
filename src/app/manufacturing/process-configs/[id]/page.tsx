import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProcessConfigForm } from "../components/process-config-form";
import { fetchProcessConfig, fetchProcesses } from "@/api/manufacturing";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Edit Process Configuration | Manufacturing | Kapsam ERP",
    description: "Edit process configuration details",
};

interface ProcessConfigPageProps {
    params: {
        id: string;
    };
}

export default async function ProcessConfigPage({ params }: ProcessConfigPageProps) {
    const [processConfig, processes] = await Promise.all([
        fetchProcessConfig(parseInt(params.id, 10)).catch(() => null),
        fetchProcesses(),
    ]);

    if (!processConfig) {
        notFound();
    }

    return (
        <div className="container py-4">
            <PageHeader
                title="İşlem Yapılandırması Düzenle"
                description={`${processConfig.id} numaralı işlem yapılandırmasını düzenleyin`}
                showBackButton
            />
            <div className="mt-6">
                <ProcessConfigForm
                    initialData={processConfig}
                    processes={processes}
                />
            </div>
        </div>
    );
} 