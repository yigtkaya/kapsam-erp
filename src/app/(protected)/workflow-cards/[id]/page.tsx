"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Clock,
  Settings2,
  ChevronDown,
  MoreVertical,
  Plus,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useWorkflow } from "../hooks/useWorkflow";
import { ProcessConfig } from "@/types/manufacture";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProcessConfigForm } from "../components/process-config-form";
import {
  useDeleteProcessConfig,
  useProcessConfigs,
  useProcessConfigsForWorkflow,
} from "../hooks/useProcessConfig";
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

export default function WorkflowProcessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [expandedProcesses, setExpandedProcesses] = useState<Set<number>>(
    new Set()
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [processToDelete, setProcessToDelete] = useState<number | null>(null);

  const {
    data: workflowProcess,
    isLoading: processLoading,
    error: processError,
  } = useWorkflow(id);

  const {
    data: processConfigs,
    isLoading: processConfigsLoading,
    error: processConfigsError,
  } = useProcessConfigsForWorkflow(id);

  const { mutate: deleteProcessConfig } = useDeleteProcessConfig();

  const toggleProcess = (processId: number) => {
    const newExpanded = new Set(expandedProcesses);
    if (newExpanded.has(processId)) {
      newExpanded.delete(processId);
    } else {
      newExpanded.add(processId);
    }
    setExpandedProcesses(newExpanded);
  };

  if (processLoading || processConfigsLoading) {
    return (
      <div className="container mx-auto py-4 space-y-6">
        <PageHeader
          title="Loading..."
          description="Loading process details..."
          showBackButton
          onBack={() => router.push("/workflow-cards")}
        />
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (
    processError ||
    !workflowProcess ||
    processConfigsError ||
    !processConfigs
  ) {
    return (
      <div className="container mx-auto py-4 space-y-6">
        <PageHeader
          title="Error"
          description="Failed to load process details"
          showBackButton
          onBack={() => router.push("/workflow-cards")}
        />
        <Card>
          <CardContent className="py-6">
            <div className="text-center text-muted-foreground">
              {processError?.message ||
                processConfigsError?.message ||
                "Process not found"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedProcessConfigs = [...processConfigs].sort(
    (a, b) => a.sequence_order - b.sequence_order
  );

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title={`İş Akış Kartı: ${workflowProcess.product_code}`}
        description={`${workflowProcess.product_name} - Versiyon ${workflowProcess.version}`}
        showBackButton
        onBack={() => router.push("/workflow-cards")}
        action={
          <div className="flex items-center space-x-2">
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Sil
            </Button>
          </div>
        }
      />

      {/* Details Section */}
      <Card>
        <CardContent className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Ürün Bilgileri
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ürün Kodu</span>
                  <span className="font-medium">
                    {workflowProcess.product_code}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ürün Adı</span>
                  <span className="font-medium">
                    {workflowProcess.product_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Versiyon</span>
                  <Badge variant="outline">{workflowProcess.version}</Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                İş Akışı Bilgileri
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Oluşturan</span>
                  <span className="font-medium">
                    {workflowProcess.created_by_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Oluşturma Tarihi</span>
                  <span className="font-medium">
                    {new Date(workflowProcess.created_at).toLocaleDateString(
                      "tr-TR"
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Proses İstatistikleri
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-2xl font-semibold">
                    {sortedProcessConfigs.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Toplam Proses</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Prosesler</CardTitle>
            <div className="flex items-center space-x-2">
              {isEditMode ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Proses Ekle
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditMode(false)}
                  >
                    Düzenlemeyi Bitir
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-32rem)]">
            {sortedProcessConfigs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Settings2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-center mb-2">
                  Henüz Proses Eklenmemiş
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Bu iş akış kartına henüz proses eklenmemiş. Düzenleme moduna
                  geçerek yeni prosesler ekleyebilirsiniz.
                </p>
                {!isEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditMode(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Düzenlemeye Başla
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {sortedProcessConfigs.map((config, index) => (
                  <div key={config.id} className="group">
                    <div
                      className={cn(
                        "flex items-center px-6 py-4 hover:bg-muted/50 cursor-pointer",
                        expandedProcesses.has(config.id) && "bg-muted/50"
                      )}
                      onClick={() => toggleProcess(config.id)}
                    >
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              {config.process_name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {config.process_code}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              {config.machine_time && (
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{config.machine_time} sn</span>
                                </div>
                              )}
                              {config.axis_count && (
                                <div className="flex items-center ml-3">
                                  <Settings2 className="h-4 w-4 mr-1" />
                                  <span>{config.axis_count}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {isEditMode && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setProcessToDelete(config.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </>
                              )}
                              <ChevronDown
                                className={cn(
                                  "h-5 w-5 text-muted-foreground transition-transform",
                                  expandedProcesses.has(config.id) &&
                                    "transform rotate-180"
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedProcesses.has(config.id) && (
                      <div className="px-6 py-4 bg-muted/25 space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                          <div className="space-y-1">
                            <label className="text-sm text-muted-foreground">
                              Stok Kodu
                            </label>
                            <p className="font-medium">{config.stock_code}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm text-muted-foreground">
                              Sıra No
                            </label>
                            <p className="font-medium">
                              {config.sequence_order}
                            </p>
                          </div>
                          {config.axis_count && (
                            <div className="space-y-1">
                              <label className="text-sm text-muted-foreground">
                                Eksen Sayısı
                              </label>
                              <p className="font-medium">{config.axis_count}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">
                            Süre Bilgileri
                          </h4>
                          <div className="grid grid-cols-3 gap-6">
                            {config.machine_time && (
                              <div className="space-y-1">
                                <label className="text-sm text-muted-foreground">
                                  Tezgah Süresi
                                </label>
                                <p className="font-medium">
                                  {config.machine_time} sn
                                </p>
                              </div>
                            )}
                            {config.setup_time && (
                              <div className="space-y-1">
                                <label className="text-sm text-muted-foreground">
                                  Hazırlık Süresi
                                </label>
                                <p className="font-medium">
                                  {config.setup_time} sn
                                </p>
                              </div>
                            )}
                            {config.number_of_bindings && (
                              <div className="space-y-1">
                                <label className="text-sm text-muted-foreground">
                                  Bağlama Sayısı
                                </label>
                                <p className="font-medium">
                                  {config.number_of_bindings}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {(config.fixture ||
                          config.tool ||
                          config.control_gauge) && (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">
                              Ekipman ve Kontrol
                            </h4>
                            <div className="grid grid-cols-3 gap-6">
                              {config.fixture && (
                                <div className="space-y-1">
                                  <label className="text-sm text-muted-foreground">
                                    Fikstür
                                  </label>
                                  <p className="font-medium">
                                    {config.fixture}
                                  </p>
                                </div>
                              )}
                              {config.tool && (
                                <div className="space-y-1">
                                  <label className="text-sm text-muted-foreground">
                                    Takım
                                  </label>
                                  <p className="font-medium">{config.tool}</p>
                                </div>
                              )}
                              {config.control_gauge && (
                                <div className="space-y-1">
                                  <label className="text-sm text-muted-foreground">
                                    Kontrol Mastarı
                                  </label>
                                  <p className="font-medium">
                                    {config.control_gauge}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {config.description && (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">
                              Açıklama
                            </h4>
                            <p className="text-sm">{config.description}</p>
                          </div>
                        )}

                        <div className="flex justify-end pt-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/workflow-cards/${workflowProcess.id}/config/${config.id}`
                                )
                              }
                            >
                              Prosese Git
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add Process Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Proses Ekle</DialogTitle>
          </DialogHeader>
          <ProcessConfigForm
            workflowProcessId={id}
            onSuccess={() => {
              setShowAddDialog(false);
              setIsEditMode(false);
              toast.success("Proses başarıyla eklendi");
            }}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={processToDelete !== null}
        onOpenChange={(open) => !open && setProcessToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Prosesi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu prosesi silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (processToDelete) {
                  deleteProcessConfig(processToDelete, {
                    onSuccess: () => {
                      toast.success("Proses başarıyla silindi");
                      setProcessToDelete(null);
                      setIsEditMode(false);
                    },
                    onError: () => {
                      toast.error("Proses silinirken bir hata oluştu");
                    },
                  });
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
