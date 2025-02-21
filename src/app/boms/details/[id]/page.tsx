"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Check, Pencil, Plus, X } from "lucide-react";
import { useBOM, useUpdateBOM } from "@/hooks/useBOMs";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";
import { toast } from "sonner";
import { BOMInfoCard } from "./components/bom-info-card";
import { TechnicalDrawings } from "./components/technical-drawings";
import { ComponentsTable } from "./components/components-table";

export default function BOMDetailsPage() {
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedVersion, setEditedVersion] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const { data: bom, isLoading, error } = useBOM(Number(params.id));
  const { data: products, isLoading: isProductLoading } = useProducts({});
  const currentProduct = products?.find((p) => p.product_code === bom?.product);
  const updateBOMMutation = useUpdateBOM();

  if (isLoading) {
    // show a circular progress indicator
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isProductLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!bom || error) {
    return <div>Reçete bulunamadı</div>;
  }

  const handleStartEditing = () => {
    setIsEditing(true);
    setEditedVersion(bom.version);
    setSelectedProduct(bom.product);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedVersion(bom.version);
    setSelectedProduct(bom.product);
  };

  const handleSaveChanges = async () => {
    try {
      await updateBOMMutation.mutateAsync({
        id: bom.id,
        data: {
          product: selectedProduct,
          version: editedVersion,
          components: bom.components,
          modified_at: new Date(),
        },
      });
      setIsEditing(false);
      toast.success("BOM updated successfully");
    } catch (error) {
      toast.error("Failed to update BOM");
    }
  };

  const actions = (
    <div className="flex gap-2">
      {isEditing ? (
        <>
          <Button variant="outline" onClick={handleCancelEditing}>
            <X className="h-4 w-4 mr-2" />
            İptal
          </Button>
          <Button onClick={handleSaveChanges}>
            <Check className="h-4 w-4 mr-2" />
            Kaydet
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={handleStartEditing}>
            <Pencil className="h-4 w-4 mr-2" />
            Düzenle
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Komponent Ekle
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-8">
      <PageHeader
        title={`BOM Detayları: ${bom.product}`}
        description={`Versiyon: ${bom.version}`}
        showBackButton
        action={actions}
      />

      <BOMInfoCard
        bom={bom}
        product={currentProduct}
        products={products}
        isEditing={isEditing}
        isProductLoading={isProductLoading}
        isCurrentProductLoading={false}
        selectedProduct={selectedProduct}
        editedVersion={editedVersion}
        open={open}
        setOpen={setOpen}
        setSelectedProduct={setSelectedProduct}
        setEditedVersion={setEditedVersion}
      />

      <TechnicalDrawings product={currentProduct} />

      <ComponentsTable components={bom.components} />
    </div>
  );
}
