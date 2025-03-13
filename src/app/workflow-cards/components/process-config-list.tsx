"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProcessConfig } from "@/types/manufacture";
import {
  useProcessConfigs,
  useDeleteProcessConfig,
} from "@/app/workflow-cards/hooks/use-process-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Timer,
  Clock,
  WrenchIcon,
  Gauge,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { ErrorBoundary } from "react-error-boundary";

interface ProcessConfigListProps {
  workflowProcessId: number;
}

function ProcessConfigListContent({
  workflowProcessId,
}: ProcessConfigListProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<number | null>(null);

  const { data: processConfigs } = useProcessConfigs(workflowProcessId);

  const { mutate: deleteProcessConfig, isPending: isDeleting } =
    useDeleteProcessConfig();

  const handleDeleteClick = (configId: number) => {
    setConfigToDelete(configId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (configToDelete) {
      deleteProcessConfig(configToDelete, {
        onSuccess: () => {
          toast.success("Process configuration deleted successfully");
          setDeleteDialogOpen(false);
          setConfigToDelete(null);
        },
        onError: (error: Error) => {
          toast.error(
            `Failed to delete process configuration: ${error.message}`
          );
        },
      });
    }
  };

  const handleAddConfig = () => {
    router.push(`/workflow-cards/${workflowProcessId}/config/new`);
  };

  const handleEditConfig = (configId: number) => {
    router.push(`/workflow-cards/${workflowProcessId}/config/${configId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Proses Konfigürasyonları</h2>
        <Button onClick={handleAddConfig}>
          <Plus className="h-4 w-4 mr-2" />
          Konfigürasyon Ekle
        </Button>
      </div>

      {processConfigs && processConfigs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {processConfigs.map((config: ProcessConfig) => (
            <ConfigCard
              key={config.id}
              config={config}
              onEdit={() => handleEditConfig(config.id)}
              onDelete={() => handleDeleteClick(config.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                Konfigürasyon Bulunamadı
              </h3>
              <p className="text-muted-foreground">
                Bu iş akışı prosesi için henüz bir konfigürasyon eklenmemiş.
              </p>
              <Button className="mt-4" onClick={handleAddConfig}>
                <Plus className="h-4 w-4 mr-2" />
                Konfigürasyon Ekle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Proses konfigürasyonu kalıcı olarak
              silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProcessConfigListFallback() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProcessConfigListError({ error }: { error: Error }) {
  return (
    <div className="bg-red-50 p-4 rounded-md text-red-800">
      Failed to load process configurations: {error.message}
    </div>
  );
}

export function ProcessConfigList(props: ProcessConfigListProps) {
  return (
    <ErrorBoundary FallbackComponent={ProcessConfigListError}>
      <Suspense fallback={<ProcessConfigListFallback />}>
        <ProcessConfigListContent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

interface ConfigCardProps {
  config: ProcessConfig;
  onEdit: () => void;
  onDelete: () => void;
}

function ConfigCard({ config, onEdit, onDelete }: ConfigCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <CardTitle className="text-lg font-medium">
          {config.axis_count_display || config.axis_count || "Standart"}
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Çevrim Zamanı:</span>
            </div>
            <span className="font-medium">{config.cycle_time || 0} sn</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm bg-muted/50 rounded-lg p-2">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Timer className="h-3 w-3" />
                <span>Hazırlık</span>
              </div>
              <span>{config.setup_time || 0} sn</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-r border-border/50">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Timer className="h-3 w-3" />
                <span>Tezgah</span>
              </div>
              <span>{config.machine_time || 0} sn</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Timer className="h-3 w-3" />
                <span>Net</span>
              </div>
              <span>{config.net_time || 0} sn</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Tools and Equipment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.tool_details && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <WrenchIcon className="h-4 w-4" />
                <span>Takım</span>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <p className="font-medium">{config.tool_details.stock_code}</p>
                <p className="text-sm text-muted-foreground">
                  {config.tool_details.tool_type}
                </p>
              </div>
            </div>
          )}

          {config.control_gauge_details && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Gauge className="h-4 w-4" />
                <span>Kontrol Mastarı</span>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <p className="font-medium">
                  {config.control_gauge_details.stock_code}
                </p>
                <p className="text-sm text-muted-foreground">
                  {config.control_gauge_details.stock_name}
                </p>
              </div>
            </div>
          )}

          {config.fixture_details && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wrench className="h-4 w-4" />
                <span>Bağlama Aparatı</span>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <p className="font-medium">{config.fixture_details.code}</p>
                {config.fixture_details.name && (
                  <p className="text-sm text-muted-foreground"></p>
                )}
              </div>{" "}
            </div>
          )}
        </div>

        {config.number_of_bindings && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Bağlama Sayısı:</span>
            <Badge variant="outline">{config.number_of_bindings}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
