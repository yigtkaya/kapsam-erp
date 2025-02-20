import { Metadata } from "next";
import { CreateBOMForm } from "../components/create-bom-form";

export const metadata: Metadata = {
  title: "Yeni Ürün Reçetesi | Kapsam ERP",
  description: "Yeni bir ürün reçetesi oluşturun",
};

export default function NewBOMPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Create New BOM</h1>
      <CreateBOMForm />
    </div>
  );
}
