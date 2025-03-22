"use client";

import { RawMaterial } from "@/types/inventory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Tag, Ruler, BarChart4 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface RawMaterialCardProps {
  material: RawMaterial;
}

export function RawMaterialCard({ material }: RawMaterialCardProps) {
  // Function to format dimensions into a readable string
  const formatDimensions = () => {
    const dimensions = [];
    if (material.width) dimensions.push(`W:${material.width}mm`);
    if (material.height) dimensions.push(`H:${material.height}mm`);
    if (material.thickness) dimensions.push(`T:${material.thickness}mm`);
    if (material.diameter_mm) dimensions.push(`D:${material.diameter_mm}mm`);
    return dimensions.join(" ");
  };

  return (
    <Link
      href={`/stock-cards/raw-material/${material.id}`}
      className="block transition-all hover:opacity-75"
    >
      <Card className="overflow-hidden h-full">
        <CardHeader>
          <CardTitle className="line-clamp-1 text-lg font-semibold">
            {material.material_name}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {material.material_code}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {formatDimensions() || "Boyut bilgisi bulunmuyor"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {material.current_stock} {material.unit.unit_code}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {material.material_type}
            </Badge>
            {material.inventory_category && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BarChart4 className="h-3 w-3" />
                {material.inventory_category.name}
              </Badge>
            )}
            {formatDimensions() && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Ruler className="h-3 w-3" />
                {formatDimensions()}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function RawMaterialCardSkeleton() {
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
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
