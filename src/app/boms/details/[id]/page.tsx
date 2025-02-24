"use client";
import { notFound, useParams } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";
import { BOMForm } from "../../components/bom-form";
import { useBOM } from "@/hooks/useBOMs";

export default function BOMDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  if (isNaN(id)) {
    notFound();
  }

  const { data: bom, isLoading, error } = useBOM(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Reçete Detayları"
        description="Reçete detaylarını görüntüleyin ve düzenleyin"
      />
      <div className="mt-6">
        <BOMForm bom={bom} />
      </div>
    </div>
  );
}
