import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProcessForm } from "../components/process-form";

export const metadata: Metadata = {
  title: "Yeni Üretim Süreci | Üretim | Kapsam ERP",
  description: "Yeni bir üretim süreci oluşturun ve yapılandırın",
};

export default function NewProcessPage() {
  return (
    <div className="container py-4">
      <PageHeader
        title="Yeni Üretim Süreci"
        description="Üretim sürecini ve özelliklerini tanımlayın"
        showBackButton
      />
      <div className="mt-6">
        <ProcessForm />
      </div>
    </div>
  );
}
