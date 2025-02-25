"use client";

import { Product } from "@/types/inventory";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    Package,
    Info,
    Calendar,
    Tag,
    BarChart4,
    FileText
} from "lucide-react";

interface ProductDetailsProps {
    product: Product | undefined;
    isLoading: boolean;
}

export function ProductDetails({ product, isLoading }: ProductDetailsProps) {
    if (isLoading) {
        return <ProductDetailsSkeleton />;
    }

    if (!product) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Ürün Detayları</CardTitle>
                    <CardDescription>Ürün bilgileri bulunamadı</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-40">
                        <p className="text-muted-foreground">Bu reçete için ürün bilgisi bulunamadı</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Ürün Detayları</CardTitle>
                            <CardDescription>Reçeteye ait ürün bilgileri</CardDescription>
                        </div>
                        <Badge variant={product.current_stock > 0 ? "default" : "destructive"}>
                            {product.current_stock > 0 ? "Stokta" : "Stokta Değil"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Package className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Ürün Bilgileri</h3>
                                    <div className="mt-2 space-y-2">
                                        <div className="grid grid-cols-3 gap-1">
                                            <p className="text-sm font-medium">Ürün Kodu:</p>
                                            <p className="text-sm text-muted-foreground col-span-2">{product.product_code}</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1">
                                            <p className="text-sm font-medium">Ürün Adı:</p>
                                            <p className="text-sm text-muted-foreground col-span-2">{product.product_name}</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1">
                                            <p className="text-sm font-medium">Ürün Tipi:</p>
                                            <p className="text-sm text-muted-foreground col-span-2">{product.product_type}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Açıklama</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {product.description || "Açıklama bulunmuyor"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <BarChart4 className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Stok Bilgileri</h3>
                                    <div className="mt-2 space-y-2">
                                        <div className="grid grid-cols-3 gap-1">
                                            <p className="text-sm font-medium">Mevcut Stok:</p>
                                            <p className="text-sm text-muted-foreground col-span-2">{product.current_stock}</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1">
                                            <p className="text-sm font-medium">Kategori:</p>
                                            <p className="text-sm text-muted-foreground col-span-2">
                                                {product.inventory_category_display || "Belirtilmemiş"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Tarih Bilgileri</h3>
                                    <div className="mt-2 space-y-2">
                                        <div className="grid grid-cols-3 gap-1">
                                            <p className="text-sm font-medium">Oluşturulma:</p>
                                            <p className="text-sm text-muted-foreground col-span-2">
                                                {new Date(product.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1">
                                            <p className="text-sm font-medium">Son Güncelleme:</p>
                                            <p className="text-sm text-muted-foreground col-span-2">
                                                {new Date(product.modified_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ProductDetailsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-[180px]" />
                <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-[150px]" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-[100px]" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-[150px]" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-[120px]" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 