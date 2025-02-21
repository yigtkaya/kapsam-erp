"use client";

import { Product } from "@/types/inventory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TechnicalDrawingsProps {
  product: Product | undefined;
}

export function TechnicalDrawings({ product }: TechnicalDrawingsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">Teknik Çizim</CardTitle>
          <CardDescription className="text-xs">
            {product?.technical_drawings?.find((d) => d.is_current)
              ?.drawing_code || "Çizim kodu bulunamadı"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-1">
            {product?.technical_drawings?.find((d) => d.is_current) ? (
              <>
                <p className="text-sm font-medium">
                  Versiyon:{" "}
                  {
                    product.technical_drawings.find((d) => d.is_current)
                      ?.version
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  Çizim Tarihi:{" "}
                  {new Date(
                    product.technical_drawings.find((d) => d.is_current)
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
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">Montaj Çizimi</CardTitle>
          <CardDescription className="text-xs">
            {product?.technical_drawings?.find(
              (d) => d.is_current && d.drawing_code.includes("ASM")
            )?.drawing_code || "Montaj çizimi bulunamadı"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-1">
            {product?.technical_drawings?.find(
              (d) => d.is_current && d.drawing_code.includes("ASM")
            ) ? (
              <>
                <p className="text-sm font-medium">
                  Versiyon:{" "}
                  {
                    product.technical_drawings.find(
                      (d) => d.is_current && d.drawing_code.includes("ASM")
                    )?.version
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  Çizim Tarihi:{" "}
                  {new Date(
                    product.technical_drawings.find(
                      (d) => d.is_current && d.drawing_code.includes("ASM")
                    )?.effective_date || ""
                  ).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">Montaj Çizimi Bulunamadı</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
