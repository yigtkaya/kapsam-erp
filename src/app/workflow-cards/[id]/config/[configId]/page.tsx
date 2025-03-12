"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkflowProcess, useProcessConfig } from "@/hooks/useManufacturing";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ProcessConfigForm } from "../../../components/process-config-form";

export default function EditProcessConfigPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = parseInt(params.id as string);
  const configId =
    params.configId === "new" ? undefined : parseInt(params.configId as string);

  const isNewConfig = !configId;

  const {
    data: workflowProcess,
    isLoading: processLoading,
    error: processError,
  } = useWorkflowProcess(workflowId);

  const {
    data: processConfig,
    isLoading: configLoading,
    error: configError,
  } = useProcessConfig(configId || 0);

  const isLoading = processLoading || (!isNewConfig && configLoading);
  const error = processError || (!isNewConfig && configError);

  const handleSuccess = () => {
    router.push(`/workflow-cards/${workflowId}`);
  };

  const handleCancel = () => {
    router.push(`/workflow-cards/${workflowId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-4 space-y-6">
        <div className="flex items-center space-x-4 pb-6">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error || !workflowProcess) {
    return (
      <div className="container mx-auto py-4 space-y-6">
        <PageHeader
          title="Error"
          description="Failed to load data"
          showBackButton
          onBack={() => router.push(`/workflow-cards/${workflowId}`)}
        />
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          {error instanceof Error ? error.message : "Data not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title={
          isNewConfig
            ? "Proses Konfigürasyonu Ekle"
            : "Proses Konfigürasyonu Düzenle"
        }
        description={`İş Akışı Prosesi: ${workflowProcess.process_details?.process_code}`}
        showBackButton
        onBack={() => router.push(`/workflow-cards/${workflowId}`)}
      />

      <ProcessConfigForm
        workflowProcessId={workflowId}
        configId={configId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
