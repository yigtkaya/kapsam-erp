"use client";

import React, { useState, Suspense } from "react";
import RawMaterialsDataTable from "./components/raw-materials-data-table";
import StandardPartsDataTable from "./components/standart-parts-data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function InventoryTabsPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hammadde ve Standart Parçalar
          </h1>
          <p className="text-muted-foreground">
            Hammadde ve standart parçaları görüntüleyin ve yönetin
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Malzeme Ekle
        </Button>
      </div>

      <Tabs defaultValue="raw-materials" className="w-full">
        <TabsList>
          <TabsTrigger value="raw-materials">Hammaddeler</TabsTrigger>
          <TabsTrigger value="standard-parts">Standart Parçalar</TabsTrigger>
        </TabsList>
        <TabsContent value="raw-materials">
          <Card className="p-4">
            <Suspense
              fallback={
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              }
            >
              <RawMaterialsDataTable />
            </Suspense>
          </Card>
        </TabsContent>
        <TabsContent value="standard-parts">
          <Card className="p-4">
            <Suspense
              fallback={
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              }
            >
              <StandardPartsDataTable />
            </Suspense>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
