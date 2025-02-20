"use client";

import { EditBOMForm } from "../components/bom-form";
import { useBOM } from "@/hooks/useBOMs";
import { useParams } from "next/navigation";

export default function EditBOMPage() {
  const params = useParams();
  const { data: bom, isLoading } = useBOM(Number(params.id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!bom) {
    return <div>BOM not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Edit BOM</h1>
      <EditBOMForm initialData={bom} />
    </div>
  );
}
