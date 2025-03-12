"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkflowProcess } from "@/hooks/useManufacturing";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProcessConfigList } from "../components/process-config-list";
import { useUrlState } from "@/hooks/useUrlState";

export default function WorkflowProcessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const { getUrlState, setUrlState } = useUrlState({ replace: true }); // Use replace to avoid adding history entries for tab changes
  const activeTab = getUrlState("tab", "basic");

  const {
    data: workflowProcess,
    isLoading: processLoading,
    error: processError,
  } = useWorkflowProcess(id);

  const isLoading = processLoading;
  const error = processError;

  const handleTabChange = (value: string) => {
    setUrlState({ tab: value });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-4 space-y-6">
        <div className="flex items-center justify-between space-x-4 pb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/workflow-cards")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !workflowProcess) {
    return (
      <div className="container mx-auto py-4 space-y-6">
        <PageHeader
          title="Hata"
          description="İş akışı kartı yüklenirken bir hata oluştu"
          showBackButton
          onBack={() => router.push("/workflow-cards")}
        />
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800">
          {error instanceof Error ? error.message : "İş akışı kartı bulunamadı"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title={`İş Akış Kartı: ${workflowProcess.stock_code}`}
        description={`Proses Adı: ${workflowProcess.process_details?.process_name}`}
        showBackButton
        onBack={() => router.push("/workflow-cards")}
        action={
          <div className="flex space-x-2">
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Sil
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
          <TabsTrigger value="configs">Proses Konfigürasyonları</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 pt-4">
          <Card>
            <CardHeader></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Proses Kodu
                  </h3>
                  <p className="text-lg">
                    {workflowProcess.process_details?.process_code}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Stok Kodu
                  </h3>
                  <p className="text-lg">{workflowProcess.stock_code}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Sıra Numarası
                  </h3>
                  <p className="text-lg">
                    <Badge>{workflowProcess.sequence_order}</Badge>
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Ürün
                </h3>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-medium">
                    {workflowProcess.product_details?.product_name || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {workflowProcess.product_details?.product_code || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  İmalat Prosesi
                </h3>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-medium">
                    {workflowProcess.process_details?.process_name || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {workflowProcess.process_details?.process_code || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configs" className="space-y-6 pt-4">
          <ProcessConfigList workflowProcessId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
