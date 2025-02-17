"use client";

import React, { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import FinishedProductsDataTable from "./components/finished-products-data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import SinglePartsDataTable from "../single-products/components/single-parts-data-table";

export default function FinishedProductsPage() {
  const [activeTab, setActiveTab] = useState<
    "finished-products" | "single-products"
  >("finished-products");

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sevke Hazır Ürün Yönetimi
          </h1>
          <p className="text-muted-foreground">
            Montajlı ürünleri ve tekil parçaları görüntüleyin ve yönetin
          </p>
        </div>
        <Link href={`/warehouse/${activeTab}/new/`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "finished-products"
              ? "Montajlı Ürün Ekle"
              : "Tekil Parça Ekle"}
          </Button>
        </Link>
      </div>

      <Tabs
        defaultValue="finished-products"
        onValueChange={(v) => setActiveTab(v as any)}
      >
        <TabsList>
          <TabsTrigger value="finished-products">Montajlı Ürünler</TabsTrigger>
          <TabsTrigger value="single-products">Tekil Parçalar</TabsTrigger>
        </TabsList>

        <TabsContent value="finished-products">
          <Suspense fallback={<DataTableSkeleton />}>
            <FinishedProductsDataTable />
          </Suspense>
        </TabsContent>

        <TabsContent value="single-products">
          <Suspense fallback={<DataTableSkeleton />}>
            <SinglePartsDataTable />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
