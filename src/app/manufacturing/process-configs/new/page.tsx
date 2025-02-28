import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProcessConfigForm } from "../components/process-config-form";
import { fetchProcesses } from "@/api/manufacturing";

export const metadata: Metadata = {
  title: "Yeni Süreç Yapılandırması | Üretim | Kapsam ERP",
  description:
    "Yeni bir süreç yapılandırması oluşturun ve özelliklerini tanımlayın",
};

export default async function NewProcessConfigPage() {
  const processes = await fetchProcesses();

  return (
    <div className="container py-4">
      <PageHeader
        title="Yeni Süreç Yapılandırması"
        description="Süreç yapılandırmasını ve özelliklerini tanımlayın"
        showBackButton
      />
      <div className="mt-6">
        <ProcessConfigForm processes={processes} />
      </div>
    </div>
  );
}
