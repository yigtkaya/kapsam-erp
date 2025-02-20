"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Pencil, Plus } from "lucide-react";
import { useBOM } from "@/hooks/useBOMs";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";

function BOMDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-[100px] mb-2" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px] mb-2" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BOMDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const { data: bom, isLoading, error } = useBOM(Number(params.id));
  const { data: product, isLoading: isProductLoading } = useProducts({
    product_code: bom?.product || "",
  });

  if (isLoading) {
    return <BOMDetailsSkeleton />;
  }

  if (!bom || error) {
    return <div>Reçete bulunamadı</div>;
  }

  const actions = (
    <div className="flex gap-2">
      <Button variant="outline">
        <Pencil className="h-4 w-4 mr-2" />
        Düzenle
      </Button>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Komponent Ekle
      </Button>
    </div>
  );

  const productName = isProductLoading ? (
    <Skeleton className="h-4 w-[200px]" />
  ) : (
    product?.[0]?.product_name || bom.product
  );

  return (
    <div className="flex flex-col gap-6 p-8">
      <PageHeader
        title={`BOM Detayları: ${bom.product}`}
        description={`Versiyon: ${bom.version}`}
        showBackButton
        action={actions}
      />

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
              <div className="text-sm text-muted-foreground">{productName}</div>
            </div>
            <div>
              <p className="text-sm font-medium">Ürün Kodu</p>
              <p className="text-sm text-muted-foreground">{bom.product}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Kategori</p>
              <p className="text-sm text-muted-foreground">
                {product?.[0]?.inventory_category_display || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Durum</p>
              <Badge variant={bom.is_active ? "default" : "secondary"}>
                {bom.is_active ? "Aktif" : "Pasif"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Oluşturulma Tarihi</p>
              <p className="text-sm text-muted-foreground">
                {new Date(bom.created_at).toLocaleDateString()}
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

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Teknik Çizim</CardTitle>
            <CardDescription>
              {product?.[0]?.technical_drawings?.find((d) => d.is_current)
                ?.drawing_code || "Çizim kodu bulunamadı"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2">
              {product?.[0]?.technical_drawings?.find((d) => d.is_current) ? (
                <>
                  <p className="text-sm font-medium">
                    Versiyon:{" "}
                    {
                      product[0].technical_drawings.find((d) => d.is_current)
                        ?.version
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Çizim Tarihi:{" "}
                    {new Date(
                      product[0].technical_drawings.find((d) => d.is_current)
                        ?.effective_date || ""
                    ).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">Teknik Çizim Bulunamadı</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Montaj Çizimi</CardTitle>
            <CardDescription>
              {product?.[0]?.technical_drawings?.find(
                (d) => d.is_current && d.drawing_code.includes("ASM")
              )?.drawing_code || "Montaj çizimi bulunamadı"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2">
              {product?.[0]?.technical_drawings?.find(
                (d) => d.is_current && d.drawing_code.includes("ASM")
              ) ? (
                <>
                  <p className="text-sm font-medium">
                    Versiyon:{" "}
                    {
                      product[0].technical_drawings.find(
                        (d) => d.is_current && d.drawing_code.includes("ASM")
                      )?.version
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Çizim Tarihi:{" "}
                    {new Date(
                      product[0].technical_drawings.find(
                        (d) => d.is_current && d.drawing_code.includes("ASM")
                      )?.effective_date || ""
                    ).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Montaj Çizimi Bulunamadı
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Komponentler</CardTitle>
          <CardDescription>
            Bu reçetede bulunan tüm komponentlerin listesi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sıra</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Komponent</TableHead>
                <TableHead>Miktar</TableHead>
                <TableHead>Notlar</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bom.components
                .sort((a, b) => a.sequence_order - b.sequence_order)
                .map((component) => (
                  <TableRow key={component.id}>
                    <TableCell>{component.sequence_order}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {component.component_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {component.component_type === "PRODUCT"
                        ? component.product
                        : component.process_config}
                    </TableCell>
                    <TableCell>{component.quantity}</TableCell>
                    <TableCell>{component.notes || "-"}</TableCell>
                    <TableCell className="text-right"></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
