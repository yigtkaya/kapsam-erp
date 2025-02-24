import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { MachineForm } from "../../components/machine-form";
import { fetchMachine } from "@/api/manufacturing";
import { notFound, useParams } from "next/navigation";

export const metadata: Metadata = {
  title: "Machine Details | Kapsam ERP",
  description: "View and edit machine details",
};

interface MachineDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function MachineDetailsPage({
  params: pageParams,
}: MachineDetailsPageProps) {
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
