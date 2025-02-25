"use client";

import { PageHeader } from "@/components/ui/page-header";
import { MachineForm } from "../../components/machine-form";
import { fetchMachine } from "@/api/manufacturing";
import { notFound, useParams } from "next/navigation";

export default async function MachineDetailsPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  if (isNaN(id)) {
    notFound();
  }

  try {
    const machine = await fetchMachine(id);

    return (
      <div className="container py-4">
        <PageHeader
          title="Makine Detayları"
          description="Makine bilgilerini görüntüleyin ve düzenleyin"
          showBackButton
        />
        <div className="mt-6">
          <MachineForm machine={machine} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
