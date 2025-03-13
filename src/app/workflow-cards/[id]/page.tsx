"use client";

import { useParams, useRouter } from "next/navigation";
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
import { useWorkflowProcess } from "../hooks/use-workflow-hooks";
import { Suspense } from "react";

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

  const handleTabChange = (value: string) => {
    setUrlState({ tab: value });
  };

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

        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <TabsContent value="configs" className="space-y-6 pt-4">
            <ProcessConfigList workflowProcessId={id} />
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  );
}
