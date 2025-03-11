"use client";

import { PageHeader } from "@/components/ui/page-header";
import { WorkflowProcessForm } from "../components/workflow-process-form";
import { useRouter } from "next/navigation";

export default function WorkflowCardNewPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title="Add Workflow Process"
        description="Create a new workflow process for a product"
        showBackButton
        onBack={() => router.push("/workflow-cards")}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <WorkflowProcessForm />
      </div>
    </div>
  );
}
