import { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkflowProcess } from "@/types/manufacture";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Timer, Clock } from "lucide-react";
import { useProcessConfigs } from "../hooks/use-workflow-hooks";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkflowProcessCardProps {
  process: WorkflowProcess;
}

export function WorkflowProcessCard({ process }: WorkflowProcessCardProps) {
  const router = useRouter();
  const { data: processConfigs, isLoading: configsLoading } = useProcessConfigs(
    process.id
  );

  const handleConfigClick = () => {
    router.push(`/workflow-cards/${process.id}`);
  };

  // Get the first config if exists
  const firstConfig = processConfigs?.[0];

  return (
    <Card className="overflow-hidden transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{process.stock_code}</CardTitle>
            <CardDescription>
              {process.product_details?.product_code || "N/A"}
            </CardDescription>
          </div>
          <Badge>{process.sequence_order}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ürün:</span>
            <span className="font-medium">
              {process.product_details?.product_name || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Proses:</span>
            <span className="font-medium">
              {process.process_details?.process_name +
                "-" +
                process.process_details?.process_code || "N/A"}
            </span>
          </div>
        </div>

        <Separator />

        {configsLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : firstConfig ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Çevrim Zamanı:</span>
              </div>
              <span className="font-medium">
                {firstConfig.cycle_time || 0} sn
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm bg-muted/50 rounded-lg p-2">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Timer className="h-3 w-3" />
                  <span>Hazırlık</span>
                </div>
                <span>{firstConfig.setup_time || 0} sn</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-l border-r border-border/50">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Timer className="h-3 w-3" />
                  <span>Tezgah</span>
                </div>
                <span>{firstConfig.machine_time || 0} sn</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Timer className="h-3 w-3" />
                  <span>Net</span>
                </div>
                <span>{firstConfig.net_time || 0} sn</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            Zaman bilgisi bulunmamaktadır
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleConfigClick}
        >
          <Settings className="mr-2 h-4 w-4" />
          Proses Konfigürasyonları
        </Button>
      </CardContent>
    </Card>
  );
}
