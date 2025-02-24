import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { MachineForm } from "../components/machine-form";

export const metadata: Metadata = {
  title: "New Machine | Kapsam ERP",
  description: "Create a new machine",
};

export default function NewMachinePage() {
  return (
    <div className="container py-4">
      <PageHeader
        title="Yeni Makine"
        description="Yeni bir üretim makinesi oluşturun"
        showBackButton
      />
      <div className="mt-6">
        <MachineForm />
      </div>
    </div>
  );
}
