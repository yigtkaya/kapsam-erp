"use client";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useBOM, useUpdateBOM } from "@/hooks/useBOMs";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";
import { BOMInfoCard } from "./components/bom-info-card";
import { ComponentsTable } from "./components/components-table";
import { TechnicalDrawings } from "./components/technical-drawings";
import { AddComponentDialog } from "./components/add-component-dialog";
import { ProductDetails } from "./components/product-details";

export default function BOMDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  if (isNaN(id)) {
    notFound();
  }

  const { data: bom, isLoading: isBOMLoading, error } = useBOM(id);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [editedVersion, setEditedVersion] = useState("");
  const [open, setOpen] = useState(false);
  const { mutate: updateBOM, isPending: isUpdating } = useUpdateBOM();
  const { data: products = [] } = useProducts({});

  const { data: product, isLoading: isProductLoading } = useProduct(
    bom?.product.id.toString() || ""
  );

  const handleEdit = () => {
    setSelectedProduct(bom?.product.product_code || "");
    setEditedVersion(bom?.version || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!bom) return;

    updateBOM(
      {
        id: bom.id,
        data: {
          product: selectedProduct,
          version: editedVersion,
          is_active: bom.is_active,
          created_at: bom.created_at,
          updated_at: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast.success("Reçete başarıyla güncellendi");
          setIsEditing(false);
        },
        onError: (error) => {
          toast.error(`Güncelleme sırasında hata oluştu: ${error.message}`);
        },
      }
    );
  };

  if (isBOMLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (error || !bom) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Reçete Detayları"
          description="Reçete detaylarını görüntüleyin ve düzenleyin"
        />
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                <X className="mr-2 h-4 w-4" />
                İptal
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isUpdating}
              >
                <Save className="mr-2 h-4 w-4" />
                Kaydet
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Düzenle
            </Button>
          )}
          <AddComponentDialog bomId={bom.id} />
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <BOMInfoCard
          bom={bom}
          product={bom.product}
          products={products}
          isEditing={isEditing}
          isProductLoading={false}
          isCurrentProductLoading={false}
          selectedProduct={selectedProduct}
          editedVersion={editedVersion}
          open={open}
          setOpen={setOpen}
          setSelectedProduct={setSelectedProduct}
          setEditedVersion={setEditedVersion}
        />

        <Tabs defaultValue="components" className="w-full">
          <TabsList>
            <TabsTrigger value="components">Komponentler</TabsTrigger>
            <TabsTrigger value="product-details">Ürün Detayları</TabsTrigger>
            <TabsTrigger value="technical-drawings">Teknik Çizimler</TabsTrigger>
          </TabsList>
          <TabsContent value="components" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Reçete Komponentleri</h3>
              <AddComponentDialog bomId={bom.id} />
            </div>
            <ComponentsTable components={bom.components || []} />
          </TabsContent>
          <TabsContent value="product-details" className="mt-4">
            <ProductDetails product={product} isLoading={isProductLoading} />
          </TabsContent>
          <TabsContent value="technical-drawings" className="mt-4">
            <TechnicalDrawings product={product} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
