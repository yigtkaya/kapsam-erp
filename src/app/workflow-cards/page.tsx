"use client";

import { WorkflowTable } from "./components/WorkflowTable";
import { useWorkflowTableData } from "./hooks/useWorkflowTableData";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WorkflowCardsPage() {
  const { data, isLoading } = useWorkflowTableData();
  const router = useRouter();

  const handleBack = () => {
    router.replace("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-4 space-y-6">
        <PageHeader
          title="İş Akış Kartları"
          description="İş akış kartlarının takibi ve yönetimi"
          showBackButton
          onBack={handleBack}
          action={
            <Button asChild>
              <Link href="/workflow-cards/new" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Yeni İş Akış Kartı
              </Link>
            </Button>
          }
        />
        <Skeleton className="w-full h-[600px]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title="İş Akış Kartları"
        description="İş akış kartlarının takibi ve yönetimi"
        showBackButton
        onBack={handleBack}
        action={
          <Button asChild>
            <Link href="/workflow-cards/new" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Yeni İş Akış Kartı
            </Link>
          </Button>
        }
      />
      <WorkflowTable data={data} />
    </div>
  );
}
