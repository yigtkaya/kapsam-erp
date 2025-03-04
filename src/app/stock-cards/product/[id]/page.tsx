"use client";

import { useDeleteProduct, useProduct } from "@/hooks/useProducts";
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
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useUpdateProduct } from "@/hooks/useProducts";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Product, ProductType, InventoryCategoryName } from "@/types/inventory";
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

// Mapping of product types to inventory categories
const productTypeToCategory: Record<ProductType, InventoryCategoryName> = {
  STANDARD_PART: "HAMMADDE", // Standard parts go to raw materials
  SEMI: "PROSES", // Semi-finished products go to process
  SINGLE: "MAMUL", // Single products go to finished products
  MONTAGED: "MAMUL", // Montaged products also go to finished products
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(params.id as string);
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }
  }, [product]);

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (error || !product || !editedProduct) {
    return <div>Ürün yüklenirken bir hata oluştu.</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Ürün başarıyla silindi");
      router.back();
    } catch (error) {
      toast.error("Ürün silinirken bir hata oluştu");
    }
  };

  const handleEdit = () => {
    setEditedProduct(product);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProduct(product);
    setIsEditing(false);
  };

  const handleProductTypeChange = (value: ProductType) => {
    setEditedProduct({
      ...editedProduct,
      product_type: value,
      // Update the inventory category based on product type
      inventory_category_display: productTypeToCategory[value],
    });
  };

  const handleSave = async () => {
    try {
      // Ensure the inventory category is set based on product type
      const productToUpdate = {
        ...editedProduct,
        inventory_category_display:
          productTypeToCategory[editedProduct.product_type],
      };

      await updateProduct.mutateAsync(productToUpdate);
      setIsEditing(false);
      toast.success("Ürün başarıyla güncellendi");
    } catch (error) {
      toast.error("Ürün güncellenirken bir hata oluştu");
    }
  };

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title={isEditing ? "Ürün Düzenle" : "Ürün Detayları"}
        description={
          isEditing
            ? "Ürün bilgilerini düzenleyin"
            : "Ürün bilgilerini görüntüleyin"
        }
        showBackButton
        action={
          isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <Undo className="h-4 w-4 mr-2" />
                İptal
              </Button>
              <Button onClick={handleSave} disabled={updateProduct.isPending}>
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
                      Ürünü silmek istediğinize emin misiniz?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Bu işlem geri alınamaz. Bu ürün kalıcı olarak
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
              <Label htmlFor="product_name">Ürün Adı</Label>
              {isEditing ? (
                <Input
                  id="product_name"
                  value={editedProduct.product_name}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      product_name: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {product.product_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_code">Ürün Kodu</Label>
              {isEditing ? (
                <Input
                  id="product_code"
                  value={editedProduct.product_code}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      product_code: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {product.product_code}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_type">Ürün Tipi</Label>
              {isEditing ? (
                <Select
                  value={editedProduct.product_type}
                  onValueChange={handleProductTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE">Tekli Parça</SelectItem>
                    <SelectItem value="SEMI">Proses Parçası</SelectItem>
                    <SelectItem value="MONTAGED">Montajlı Parça</SelectItem>
                    <SelectItem value="STANDARD_PART">
                      Standart Parça
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 w-fit"
                >
                  <Tag className="h-3 w-3" />
                  {product.product_type}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_stock">Stok Miktarı</Label>
              {isEditing ? (
                <Input
                  id="current_stock"
                  type="number"
                  value={editedProduct.current_stock}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
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
                  {product.current_stock}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="grid gap-4 p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Açıklama</h2>
          {isEditing ? (
            <Textarea
              value={editedProduct.description || ""}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  description: e.target.value,
                })
              }
              placeholder="Ürün açıklaması girin..."
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {product.description || "Açıklama bulunmuyor"}
            </p>
          )}
        </div>

        {/* Additional Info Section */}
        <div className="grid gap-4 p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Diğer Bilgiler</h2>
          <div className="grid gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Oluşturulma:{" "}
              {format(new Date(product.created_at), "d MMMM yyyy", {
                locale: tr,
              })}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Son Güncelleme:{" "}
              {format(new Date(product.modified_at), "d MMMM yyyy", {
                locale: tr,
              })}
            </div>
            {editedProduct.inventory_category_display && (
              <div className="flex items-center gap-2">
                <BarChart4 className="h-4 w-4" />
                Kategori: {editedProduct.inventory_category_display}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
