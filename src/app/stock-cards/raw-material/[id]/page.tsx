"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Tag,
  BarChart4,
  Calendar,
  Save,
  Undo,
  Edit,
  Trash,
  Ruler,
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  RawMaterial,
  MaterialType,
  InventoryCategoryName,
} from "@/types/inventory";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useRawMaterial,
  useUpdateRawMaterial,
  useDeleteRawMaterial,
} from "@/hooks/useRawMaterials";

export default function RawMaterialDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const {
    data: material,
    isLoading,
    error,
  } = useRawMaterial({ id: params.id as string });
  const updateMaterial = useUpdateRawMaterial();
  const deleteMaterial = useDeleteRawMaterial();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMaterial, setEditedMaterial] = useState<RawMaterial | null>(
    null
  );

  useEffect(() => {
    if (material) {
      setEditedMaterial(material);
    }
  }, [material]);

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (error || !material || !editedMaterial) {
    return <div>Hammadde yüklenirken bir hata oluştu.</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteMaterial.mutateAsync(material.id);
      toast.success("Hammadde başarıyla silindi");
      router.back();
    } catch (error) {
      toast.error("Hammadde silinirken bir hata oluştu");
    }
  };

  const handleEdit = () => {
    setEditedMaterial(material);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedMaterial(material);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateMaterial.mutateAsync(editedMaterial);
      setIsEditing(false);
      toast.success("Hammadde başarıyla güncellendi");
    } catch (error) {
      toast.error("Hammadde güncellenirken bir hata oluştu");
    }
  };

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title={isEditing ? "Hammadde Düzenle" : "Hammadde Detayları"}
        description={
          isEditing
            ? "Hammadde bilgilerini düzenleyin"
            : "Hammadde bilgilerini görüntüleyin"
        }
        showBackButton
        action={
          isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <Undo className="h-4 w-4 mr-2" />
                İptal
              </Button>
              <Button onClick={handleSave} disabled={updateMaterial.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Kaydet
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash className="h-4 w-4 mr-2" />
                    Sil
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Hammaddeyi silmek istediğinize emin misiniz?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Bu işlem geri alınamaz. Bu hammadde kalıcı olarak
                      silinecektir.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sil
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
          )
        }
      />

      <div className="grid gap-6">
        {/* Basic Info Section */}
        <div className="grid gap-4 p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Temel Bilgiler</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="material_name">Hammadde Adı</Label>
              {isEditing ? (
                <Input
                  id="material_name"
                  value={editedMaterial.material_name}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      material_name: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {material.material_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="material_code">Hammadde Kodu</Label>
              {isEditing ? (
                <Input
                  id="material_code"
                  value={editedMaterial.material_code}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      material_code: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {material.material_code}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="material_type">Malzeme Tipi</Label>
              {isEditing ? (
                <Select
                  value={editedMaterial.material_type}
                  onValueChange={(value: MaterialType) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      material_type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STEEL">Çelik</SelectItem>
                    <SelectItem value="ALUMINUM">Alüminyum</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 w-fit"
                >
                  <Tag className="h-3 w-3" />
                  {material.material_type === "STEEL" ? "Çelik" : "Alüminyum"}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_stock">Stok Miktarı</Label>
              {isEditing ? (
                <Input
                  id="current_stock"
                  type="number"
                  value={editedMaterial.current_stock}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      current_stock: parseInt(e.target.value),
                    })
                  }
                />
              ) : (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 w-fit"
                >
                  <Package className="h-3 w-3" />
                  {material.current_stock} {material.unit?.unit_code}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Dimensions Section */}
        <div className="grid gap-4 p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Ölçüler</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="width">Genişlik (mm)</Label>
              {isEditing ? (
                <Input
                  id="width"
                  type="number"
                  value={editedMaterial.width || ""}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      width: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  {material.width ? `${material.width} mm` : "Belirtilmemiş"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Yükseklik (mm)</Label>
              {isEditing ? (
                <Input
                  id="height"
                  type="number"
                  value={editedMaterial.height || ""}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      height: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  {material.height ? `${material.height} mm` : "Belirtilmemiş"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thickness">Kalınlık (mm)</Label>
              {isEditing ? (
                <Input
                  id="thickness"
                  type="number"
                  value={editedMaterial.thickness || ""}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      thickness: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  {material.thickness
                    ? `${material.thickness} mm`
                    : "Belirtilmemiş"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diameter">Çap (mm)</Label>
              {isEditing ? (
                <Input
                  id="diameter_mm"
                  type="number"
                  value={editedMaterial.diameter_mm || ""}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      diameter_mm: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  {material.diameter_mm
                    ? `${material.diameter_mm} mm`
                    : "Belirtilmemiş"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Category Info Section */}
        <div className="grid gap-4 p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Kategori Bilgileri</h2>
          <div className="grid gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4" />
              Kategori: {material.inventory_category?.name || "HAMMADDE"}
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Birim: {material.unit?.unit_name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
