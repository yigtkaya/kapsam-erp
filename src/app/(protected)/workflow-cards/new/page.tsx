"use client";

import { PageHeader } from "@/components/ui/page-header";
import { WorkflowCreateForm } from "../components/WorkflowCreateForm";
import { useRouter } from "next/navigation";

export default function WorkflowCardNewPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title="İş Akış Kartı Ekle"
        description="Ürünler için iş akışı kartını oluşturun"
        showBackButton
        onBack={() => router.push("/workflow-cards")}
      />

      <WorkflowCreateForm />
    </div>
  );
}
