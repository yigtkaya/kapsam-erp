"use client";

import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProcessConfigForm } from "../components/process-config-form";
import { fetchProcessConfig, fetchProcesses } from "@/api/manufacturing";
import { notFound, useParams } from "next/navigation";
import { useProcessConfig } from "@/hooks/useProcessConfig";
import { useProcesses } from "@/hooks/useManufacturing";
import { Suspense } from "react";

export default async function ProcessConfigPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const { data: processConfig, isLoading, error } = useProcessConfig(id);
  const { data: processes } = useProcesses();

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
        <Suspense fallback={<div>Loading...</div>}>
          <ProcessConfigForm
            initialData={processConfig}
            processes={processes}
          />
        </Suspense>
      </div>
    </div>
  );
}
