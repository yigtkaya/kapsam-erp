"use client";
import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useBOM, useUpdateBOM } from "@/hooks/useBOMs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";
import { BOMInfoCard } from "./components/bom-info-card";
import { ComponentsTable } from "./components/components-table";
import { TechnicalDrawings } from "./components/technical-drawings";
import { ProductDetails } from "./components/product-details";

export default function BOMDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(params.id);

  if (isNaN(id)) {
    notFound();
  }

  const { data: bom, isLoading: isBOMLoading, error } = useBOM(id);
  const isEditing = searchParams.get("edit") === "true";
  const [editedVersion, setEditedVersion] = useState("");
  const { mutate: updateBOM, isPending: isUpdating } = useUpdateBOM();

  const handleEdit = () => {
    setEditedVersion(bom?.version || "");
    const params = new URLSearchParams(searchParams);
    params.set("edit", "true");
    router.push(`?${params.toString()}`);
  };

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("edit");
    router.push(`?${params.toString()}`);
  };

  const handleSave = () => {
    if (!bom) return;

    updateBOM(
      {
        id: bom.id,
        data: {
          product: bom.product.product_code, // Keep existing product
          version: editedVersion,
          is_active: bom.is_active,
          created_at: bom.created_at,
          updated_at: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast.success("Reçete başarıyla güncellendi");
          const params = new URLSearchParams(searchParams);
          params.delete("edit");
          router.push(`?${params.toString()}`);
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
          showBackButton
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
              <Button size="sm" onClick={handleSave} disabled={isUpdating}>
                <Save className="mr-2 h-4 w-4" />
                Kaydet
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Düzenle
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <BOMInfoCard
          bom={bom}
          product={bom.product}
          isEditing={isEditing}
          editedVersion={editedVersion}
          setEditedVersion={setEditedVersion}
        />

        <Tabs defaultValue="components" className="w-full">
          <TabsList>
            <TabsTrigger value="components">Komponentler</TabsTrigger>
            <TabsTrigger value="product-details">Ürün Detayları</TabsTrigger>
            <TabsTrigger value="technical-drawings">
              Teknik Çizimler
            </TabsTrigger>
          </TabsList>
          <TabsContent value="components" className="mt-4">
            <ComponentsTable />
          </TabsContent>
          <TabsContent value="product-details" className="mt-4">
            <ProductDetails product={bom.product} isLoading={false} />
          </TabsContent>
          <TabsContent value="technical-drawings" className="mt-4">
            <TechnicalDrawings product={bom.product} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
