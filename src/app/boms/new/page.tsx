import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { BOMForm } from "../components/bom-form";

export const metadata: Metadata = {
  title: "Yeni Reçete | Kapsam ERP",
  description: "Yeni bir reçete oluşturun",
};

export default function NewBOMPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Yeni Reçete" description="Yeni bir reçete oluşturun" />
      <div className="mt-6">
        <BOMForm />
      </div>
    </div>
  );
}
