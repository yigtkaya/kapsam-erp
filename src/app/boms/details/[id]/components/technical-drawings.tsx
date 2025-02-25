"use client";

import { Product } from "@/types/inventory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ZoomIn, Printer, Share2 } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface TechnicalDrawingsProps {
  product: Product | undefined;
}

export function TechnicalDrawings({ product }: TechnicalDrawingsProps) {
  const hasDrawings = product?.technical_drawings && product.technical_drawings.length > 0;
  const currentDrawing = product?.technical_drawings?.find((d) => d.is_current);
  const assemblyDrawing = product?.technical_drawings?.find(
    (d) => d.is_current && d.drawing_code.includes("ASM")
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teknik Çizimler</CardTitle>
          <CardDescription>
            Ürüne ait teknik çizim ve montaj şemaları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="technical" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="technical">Teknik Çizim</TabsTrigger>
              <TabsTrigger value="assembly">Montaj Çizimi</TabsTrigger>
            </TabsList>

            <TabsContent value="technical">
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted relative flex items-center justify-center">
                  {currentDrawing ? (
                    currentDrawing.drawing_url ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={currentDrawing.drawing_url}
                          alt="Teknik Çizim"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <p className="text-lg font-medium">Teknik Çizim</p>
                        <p className="text-sm text-muted-foreground">
                          Çizim Kodu: {currentDrawing.drawing_code}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Versiyon: {currentDrawing.version}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Görsel şu anda mevcut değil
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 p-4">
                      <p className="text-muted-foreground">Teknik çizim bulunamadı</p>
                    </div>
                  )}
                </div>

                {currentDrawing && (
                  <div className="p-4 bg-muted/20 border-t">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{currentDrawing.drawing_code}</h3>
                          <p className="text-sm text-muted-foreground">
                            Versiyon: {currentDrawing.version} •
                            Tarih: {new Date(currentDrawing.effective_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" title="Yakınlaştır">
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" title="İndir">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" title="Yazdır">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {currentDrawing.revision_notes && (
                        <p className="text-sm mt-2">
                          <span className="font-medium">Revizyon Notları:</span>{" "}
                          {currentDrawing.revision_notes}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="assembly">
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted relative flex items-center justify-center">
                  {assemblyDrawing ? (
                    assemblyDrawing.drawing_url ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={assemblyDrawing.drawing_url}
                          alt="Montaj Çizimi"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <p className="text-lg font-medium">Montaj Çizimi</p>
                        <p className="text-sm text-muted-foreground">
                          Çizim Kodu: {assemblyDrawing.drawing_code}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Versiyon: {assemblyDrawing.version}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Görsel şu anda mevcut değil
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 p-4">
                      <p className="text-muted-foreground">Montaj çizimi bulunamadı</p>
                    </div>
                  )}
                </div>

                {assemblyDrawing && (
                  <div className="p-4 bg-muted/20 border-t">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{assemblyDrawing.drawing_code}</h3>
                          <p className="text-sm text-muted-foreground">
                            Versiyon: {assemblyDrawing.version} •
                            Tarih: {new Date(assemblyDrawing.effective_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" title="Yakınlaştır">
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" title="İndir">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" title="Yazdır">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {assemblyDrawing.revision_notes && (
                        <p className="text-sm mt-2">
                          <span className="font-medium">Revizyon Notları:</span>{" "}
                          {assemblyDrawing.revision_notes}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            {hasDrawings
              ? `Toplam ${product?.technical_drawings?.length || 0} teknik çizim mevcut`
              : "Bu ürün için teknik çizim bulunmamaktadır"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
