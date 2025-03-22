"use client";

import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProcessForm } from "../../components/process-form";
import { notFound, useParams } from "next/navigation";
import { useProcess } from "@/hooks/useManufacturing";

export default function ProcessDetailsPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  if (isNaN(id)) {
    notFound();
  }

  try {
    const { data: process, isLoading, error } = useProcess(id);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <div className="container py-4">
        <PageHeader
          title="Süreç Detayları"
          description="Süreç bilgilerini görüntüleyin ve düzenleyin"
          showBackButton
        />
        <div className="mt-6">
          <ProcessForm process={process} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
