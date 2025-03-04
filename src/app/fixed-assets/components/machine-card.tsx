"use client";

import { Machine } from "@/types/manufacture";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Settings2, BarChart4 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface MachineCardProps {
  machine: Machine;
}

export function MachineCard({ machine }: MachineCardProps) {
  return (
    <Link
      href={`/fixed-assets/${machine.id}`}
      className="block transition-all hover:opacity-75"
    >
      <Card className="overflow-hidden h-full">
        <CardHeader>
          <CardTitle className="line-clamp-1 text-lg font-semibold">
            {machine.machine_name}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {machine.machine_code}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {machine.description || "Açıklama bulunmuyor"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Settings2 className="h-3 w-3" />
              {machine.status || "Durum Belirtilmemiş"}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {machine.machine_type || "Tip Belirtilmemiş"}
            </Badge>
            {machine.category_display && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BarChart4 className="h-3 w-3" />
                {machine.category_display}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function MachineCardSkeleton() {
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
