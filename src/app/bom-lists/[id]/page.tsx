"use client";

import { useBOM, useUpdateBOM } from "@/hooks/useBOMs";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Loader2, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import { AddComponentDialog } from "../components/add-component-dialog";
import { BOMComponentList } from "../components/bom-component-list";

export default function BOMDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [isAddComponentOpen, setIsAddComponentOpen] = useState(false);
  const { data: bom, isLoading, error } = useBOM(parseInt(params.id as string));
  const { mutate: updateBOM, isPending: isUpdating } = useUpdateBOM();

  const handleStatusChange = () => {
    if (!bom) return;

    updateBOM(
      {
        id: bom.id,
        data: {
          product: bom.product.product_code,
          version: bom.version,
          is_active: !bom.is_active,
        },
      },
      {
        onSuccess: () => {
          toast.success("Ürün ağacı durumu güncellendi.");
        },
        onError: () => {
          toast.error("Ürün ağacı durumu güncellenirken bir hata oluştu.");
        },
      }
    );
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Hata</AlertTitle>
        <AlertDescription>
          Ürün ağacı yüklenirken bir hata oluştu: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!bom) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Hata</AlertTitle>
        <AlertDescription>Ürün ağacı bulunamadı.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title={`${bom.product?.product_name || "İsimsiz Ürün"} - ${
          bom.version
        }`}
        description="Ürün ağacı detayları ve bileşenleri"
        showBackButton
        onBack={() => router.back()}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant={bom.is_active ? "outline" : "default"}
              onClick={handleStatusChange}
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {bom.is_active ? "Pasife Al" : "Aktife Al"}
            </Button>
            <Button onClick={() => setIsAddComponentOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Bileşen Ekle
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Genel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Durum
              </h4>
              <Badge
                variant={bom.is_active ? "default" : "secondary"}
                className="mt-1"
              >
                {bom.is_active ? "Aktif" : "Pasif"}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Onay Durumu
              </h4>
              <Badge
                variant={bom.is_approved ? "default" : "secondary"}
                className="mt-1"
              >
                {bom.is_approved ? "Onaylı" : "Onay Bekliyor"}
              </Badge>
            </div>

            {bom.approved_by && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Onaylayan
                </h4>
                <p className="mt-1">
                  {bom.approved_by.first_name} {bom.approved_by.last_name}
                </p>
              </div>
            )}

            {bom.approved_at && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Onay Tarihi
                </h4>
                <p className="mt-1">
                  {format(new Date(bom.approved_at), "d MMMM yyyy", {
                    locale: tr,
                  })}
                </p>
              </div>
            )}

            {bom.notes && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Notlar
                </h4>
                <p className="mt-1 whitespace-pre-wrap">{bom.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ürün Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Ürün Adı
              </h4>
              <p className="mt-1">
                {bom.product?.product_name || "İsimsiz Ürün"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Versiyon
              </h4>
              <p className="mt-1">{bom.version}</p>
            </div>

            {bom.parent_bom && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Üst Ürün Ağacı
                </h4>
                <p className="mt-1">#{bom.parent_bom}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4">Bileşenler</h2>
        <BOMComponentList bomId={bom.id} components={bom.components || []} />
      </div>

      <AddComponentDialog
        open={isAddComponentOpen}
        onOpenChange={setIsAddComponentOpen}
        bomId={bom.id}
      />
    </div>
  );
}
