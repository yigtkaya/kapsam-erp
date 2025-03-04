"use client";

import { Machine, MachineStatus, needsMaintenance } from "@/types/manufacture";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, AlertTriangle, Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MachineCardProps {
  machine: Machine;
}

export function MachineCard({ machine }: MachineCardProps) {
  const requiresMaintenance = needsMaintenance(machine);

  const getStatusColor = (status: MachineStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "IN_USE":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "MAINTENANCE":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const getStatusText = (status: MachineStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "Müsait";
      case "IN_USE":
        return "Kullanımda";
      case "MAINTENANCE":
        return "Bakımda";
      default:
        return "Bilinmiyor";
    }
  };

  return (
    <Card className="relative">
      {requiresMaintenance && (
        <div className="absolute -top-2 -right-2">
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Bakım Gerekli
          </Badge>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{machine.machine_code}</CardTitle>
            <CardDescription>
              {machine.brand} {machine.model}
            </CardDescription>
          </div>
          <Badge
            variant={
              machine.status === MachineStatus.AVAILABLE
                ? "default"
                : machine.status === MachineStatus.MAINTENANCE
                ? "destructive"
                : "secondary"
            }
          >
            {machine.status === MachineStatus.AVAILABLE
              ? "Müsait"
              : machine.status === MachineStatus.MAINTENANCE
              ? "Bakımda"
              : "Kullanımda"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="text-muted-foreground">Makine Tipi</div>
          <div>{machine.machine_type}</div>

          {machine.axis_count && (
            <>
              <div className="text-muted-foreground">Eksen Sayısı</div>
              <div>{machine.axis_count}</div>
            </>
          )}

          {machine.manufacturing_year && (
            <>
              <div className="text-muted-foreground">Üretim Yılı</div>
              <div>{new Date(machine.manufacturing_year).getFullYear()}</div>
            </>
          )}

          {machine.nc_control_unit && (
            <>
              <div className="text-muted-foreground">Kontrol Ünitesi</div>
              <div>{machine.nc_control_unit}</div>
            </>
          )}
        </div>

        {machine.description && (
          <div className="pt-2 text-sm text-muted-foreground">
            {machine.description}
          </div>
        )}

        {machine.last_maintenance_date && (
          <div className="pt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Wrench className="h-4 w-4" />
            <span>
              Son Bakım:{" "}
              {new Date(machine.last_maintenance_date).toLocaleDateString(
                "tr-TR"
              )}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href={`/fixed-assets/${machine.id}`}
          className={cn(
            "w-full",
            requiresMaintenance && "animate-pulse text-destructive"
          )}
        >
          <Button variant="outline" className="w-full gap-2">
            <Edit className="h-4 w-4" />
            Detayları Görüntüle
          </Button>
        </Link>
      </CardFooter>
    </Card>
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
