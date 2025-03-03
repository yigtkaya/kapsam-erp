"use client";

import { Product } from "@/types/inventory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Tag, BarChart4 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/stock-cards/${product.id}`}
      className="block transition-all hover:opacity-75"
    >
      <Card className="overflow-hidden h-full">
        <CardHeader>
          <CardTitle className="line-clamp-1 text-lg font-semibold">
            {product.product_name}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {product.product_code}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description || "Açıklama bulunmuyor"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {product.current_stock}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {product.product_type}
            </Badge>
            {product.inventory_category_display && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BarChart4 className="h-3 w-3" />
                {product.inventory_category_display}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
