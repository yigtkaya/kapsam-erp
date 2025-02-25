"use client";

import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProcessConfigForm } from "../../components/process-config-form";
import { BOMProcessConfig } from "@/types/manufacture";
import { notFound, useParams } from "next/navigation";
import { useProcessConfig } from "@/hooks/useProcessConfig";





export default async function ProcessConfigPage() {
    const params = useParams();
    const id = parseInt(params.id as string);

    const { data: processConfig } = useProcessConfig(id);

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
                />
            </div>
        </div>
    );
} 