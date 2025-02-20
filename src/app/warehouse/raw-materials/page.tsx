"use client";

import React, { Suspense, useState } from "react";
import RawMaterialsDataTable from "./components/raw-materials-data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import StandardPartsDataTable from "../standard-parts/components/standart-parts-data-table";
import { PageHeader } from "@/components/ui/page-header";
export default function RawMaterialsPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "raw-materials";

  const [activeTab, setActiveTab] = useState<
    "raw-materials" | "standard-parts"
  >(defaultTab as "raw-materials" | "standard-parts");

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <PageHeader
            title="Hammadde ve Standart Parçalar"
            description="Hammadde ve standart parçaları görüntüleyin ve yönetin"
            showBackButton
          />
        </div>
        <Link
          href={
            activeTab === "standard-parts"
              ? "/warehouse/standard-parts/new"
              : "/warehouse/raw-materials/new"
          }
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "raw-materials"
              ? "Hammadde Ekle"
              : "Standart Parça Ekle"}
          </Button>
        </Link>
      </div>

      <Tabs
        defaultValue={defaultTab}
        className="w-full"
        onValueChange={(value) =>
          setActiveTab(value as "raw-materials" | "standard-parts")
        }
      >
        <TabsList>
          <TabsTrigger value="raw-materials">Hammaddeler</TabsTrigger>
          <TabsTrigger value="standard-parts">Standart Parçalar</TabsTrigger>
        </TabsList>
        <TabsContent value="raw-materials">
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
        </TabsContent>
        <TabsContent value="standard-parts">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
