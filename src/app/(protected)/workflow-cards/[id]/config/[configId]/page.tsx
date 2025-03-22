"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ProcessConfigForm } from "../../../components/process-config-form";
import { useWorkflow } from "@/app/(protected)/workflow-cards/hooks/useWorkflow";
import { useProcessConfig } from "@/app/(protected)/workflow-cards/hooks/useProcessConfig";
import { useDeleteProcessConfig } from "@/app/(protected)/workflow-cards/hooks/useProcessConfig";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";

export default function EditProcessConfigPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = parseInt(params.id as string);
  const configId =
    params.configId === "new" ? undefined : parseInt(params.configId as string);
  const isNewConfig = !configId;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: workflow,
    isLoading: workflowLoading,
    error: workflowError,
  } = useWorkflow(workflowId);

  const {
    data: processConfig,
    isLoading: configLoading,
    error: configError,
  } = useProcessConfig(isNewConfig ? 0 : (configId as number));

  const { mutate: deleteProcessConfig, isPending: isDeleting } =
    useDeleteProcessConfig();

  const isLoading = workflowLoading || (!isNewConfig && configLoading);
  const error = workflowError || (!isNewConfig && configError);

  const handleSuccess = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const handleDelete = () => {
    if (configId) {
      deleteProcessConfig(configId, {
        onSuccess: () => {
          toast.success("Proses konfigürasyonu başarıyla silindi");
          router.back();
        },
        onError: (error) => {
          toast.error(`Proses konfigürasyonu silinemedi: ${error.message}`);
        },
      });
    }
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

  if (error || !workflow) {
    return (
      <div className="container mx-auto py-4 space-y-6">
        <PageHeader
          title="Hata"
          description="Veri yüklenemedi"
          showBackButton
          onBack={() => router.push(`/workflow-cards/${workflowId}`)}
        />
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          {error instanceof Error ? error.message : "Veri bulunamadı"}
        </div>
      </div>
    );
  }

  const getDescription = () => {
    if (isNewConfig) {
      return `İş Akışı: ${workflow.product_name || workflow.product_code}`;
    }
    if (processConfig) {
      return `İş Akışı: ${
        workflow.product_name || workflow.product_code
      } - Proses: ${processConfig.process_code || ""}`;
    }
    return "";
  };

  return (
    <div className="container mx-auto py-4 space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader
          title={
            isNewConfig
              ? "Yeni Proses Konfigürasyonu"
              : "Proses Konfigürasyonu Düzenle"
          }
          description={getDescription()}
          showBackButton
        />
        {!isNewConfig && (
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Proses Konfigürasyonunu Sil</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu proses konfigürasyonunu silmek istediğinizden emin misiniz?
                  Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Siliniyor..." : "Sil"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <ProcessConfigForm
        workflowProcessId={workflowId}
        configId={configId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
