import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProcessForm } from "../../components/process-form";
import { fetchProcess } from "@/api/manufacturing";
import { notFound, useParams } from "next/navigation";

export const metadata: Metadata = {
  title: "Process Details | Kapsam ERP",
  description: "View and edit process details",
};

interface ProcessDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function ProcessDetailsPage({
  params: pageParams,
}: ProcessDetailsPageProps) {
  const params = useParams();
  const id = parseInt(params.id as string);

  if (isNaN(id)) {
    notFound();
  }

  try {
    const process = await fetchProcess(id);

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
