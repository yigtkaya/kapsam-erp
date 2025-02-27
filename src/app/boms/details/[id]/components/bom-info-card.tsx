"use client";

import { BOMResponse } from "@/types/manufacture";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/inventory";

interface BOMInfoCardProps {
  bom: BOMResponse;
  product: Product;
  isEditing: boolean;
  editedVersion: string;
  setEditedVersion: (version: string) => void;
}

export function BOMInfoCard({
  bom,
  product,
  isEditing,
  editedVersion,
  setEditedVersion,
}: BOMInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ürün ve Reçete Bilgileri</CardTitle>
        <CardDescription>
          Ürün ve reçete hakkında detaylı bilgiler
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium">Ürün</p>
            <div className="text-sm text-muted-foreground">
              {product?.product_name}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Kategori</p>
            <p className="text-sm text-muted-foreground">
              {product?.inventory_category_display || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Durum</p>
            <Badge variant={bom.is_active ? "default" : "secondary"}>
              {bom.is_active ? "Aktif" : "Pasif"}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium">Versiyon</p>
            {isEditing ? (
              <Input
                value={editedVersion}
                onChange={(e) => setEditedVersion(e.target.value)}
                className="w-full"
                placeholder="Versiyon girin"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{bom.version}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">Stok Miktarı</p>
            <p className="text-sm text-muted-foreground">
              {product?.current_stock || 0}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Son Güncelleme</p>
            <p className="text-sm text-muted-foreground">
              {new Date(bom.modified_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
