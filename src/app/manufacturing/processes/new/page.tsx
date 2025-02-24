import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProcessForm } from "../components/process-form";

export const metadata: Metadata = {
  title: "New Manufacturing Process | Kapsam ERP",
  description: "Create a new manufacturing process",
};

export default function NewProcessPage() {
  return (
    <div className="container py-4">
      <PageHeader
        title="Yeni Üretim Süreci"
        description="Yeni bir üretim süreci oluşturun"
        showBackButton
      />
      <div className="mt-6">
        <ProcessForm />
      </div>
    </div>
  );
}
