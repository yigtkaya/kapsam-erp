import { Metadata } from "next";
import { CreateBOMForm } from "../components/create-bom-form";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Yeni Ürün Reçetesi | Kapsam ERP",
  description: "Yeni bir ürün reçetesi oluşturun",
};

export default function NewBOMPage() {
  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="Yeni Ürün Reçetesi"
        description="Yeni bir ürün reçetesi oluşturun"
        showBackButton
      />
      <CreateBOMForm />
    </div>
  );
}
