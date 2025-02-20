"use client";

import { useBOM } from "@/hooks/useBOMs";
import { EditBOMForm } from "./edit-bom-form";

interface BOMDetailsProps {
  id: number;
}

export function BOMDetails({ id }: BOMDetailsProps) {
  const { data: bom, isLoading } = useBOM(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!bom) {
    return <div>BOM not found</div>;
  }

  return <EditBOMForm initialData={bom} />;
}
