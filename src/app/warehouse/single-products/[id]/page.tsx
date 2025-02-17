"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/useProducts";
import { EditMontagedProductForm } from "../components/edit-single-products";

export default function EditSingleProductPage() {
  const params = useParams();
  const {
    data: singleProduct,
    isLoading,
    error,
  } = useProduct(params.id as string);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-[200px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!singleProduct) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Montajlı ürün bulunamadı</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Montajlı Ürün Düzenle</CardTitle>
      </CardHeader>
      <CardContent>
        <EditMontagedProductForm montagedProduct={singleProduct} />
      </CardContent>
    </Card>
  );
}
