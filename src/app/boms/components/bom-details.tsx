"use client";

import { useBOM } from "@/hooks/useBOMs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BOMProcessList } from "./bom-process-list";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { BOMGeneralInfo } from "./bom-general-info";
import { BOMComponentList } from "./bom-component-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BOMDetailsProps {
  id: number;
}

export function BOMDetails({ id }: BOMDetailsProps) {
  const { data: bom, isLoading, error } = useBOM(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !bom) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message || "Failed to load BOM details"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>BOM Details - {bom.product}</span>
          <div className="space-x-2">
            <Button variant="outline">Export</Button>
            <Button>Save Changes</Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="processes">Manufacturing Processes</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <BOMGeneralInfo bom={bom} />
          </TabsContent>

          <TabsContent value="components">
            <BOMComponentList
              components={bom.components.filter(
                (c) => c.component_type === "PRODUCT"
              )}
              bomId={bom.id}
            />
          </TabsContent>

          <TabsContent value="processes">
            <BOMProcessList
              processes={bom.components.filter(
                (c) => c.component_type === "PROCESS"
              )}
              bomId={bom.id}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
