"use client";

import { Metadata } from "next";
import { notFound, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddComponentButton } from "./components/add-component-button";
import { BOMComponentsTable } from "./components/bom-components-table";
import { useBOM } from "@/hooks/useBOMs";
import router from "next/router";

export default function BOMComponentsPage() {
  const params = useParams();
  const id = Number(params.id);

  if (!id) {
    return (
      <div>
        Error: No ID provided
        <Button onClick={() => router.back()}>Geri Dön</Button>
      </div>
    );
  }

  const { data: bom, isLoading, error } = useBOM(id);

  if (isLoading) {
    return (
      <div>
        Loading...
        <Button onClick={() => router.back()}>Geri Dön</Button>
      </div>
    );
  }

  if (error || !bom) {
    return (
      <div>
        Error: {error?.message}
        <Button onClick={() => router.back()}>Geri Dön</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title={`Reçete Bileşenleri: ${bom.product.product_name}`}
        description={`Versiyon: ${bom.version}`}
        action={
          <Link href={`/boms/details/${id}`}>
            <Button variant="outline">Reçete Detayları</Button>
          </Link>
        }
      />

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Bileşenler</h3>
          <AddComponentButton />
        </div>

        <BOMComponentsTable initialComponents={bom.components || []} />
      </div>
    </div>
  );
}
