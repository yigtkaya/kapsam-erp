"use client";

import { BOMComponent } from "@/types/manufacture";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ComponentsTableProps {
  components: BOMComponent[];
}

export function ComponentsTable({ components }: ComponentsTableProps) {
  const renderComponentDetails = (component: BOMComponent) => {
    if (!component.details) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-red-500">Missing details</span>
          <span className="text-sm text-muted-foreground">
            Component data is incomplete
          </span>
        </div>
      );
    }

    if (component.details.type === "PRODUCT") {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{component.details.product.name}</span>
          <span className="text-sm text-muted-foreground">
            {component.details.product.product_code}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {component.details.process_config.process_name}
          </span>
          <span className="text-sm text-muted-foreground">
            {component.details.process_config.process_code}
          </span>
          {component.details.raw_material && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">
                Raw Material:
              </span>
              <span className="text-xs">
                {component.details.raw_material.name}
              </span>
            </div>
          )}
        </div>
      );
    }
  };

  const renderComponentType = (component: BOMComponent) => {
    const type = component.component_type;
    const variant = type === "PRODUCT" ? "default" : "secondary";
    const label = type === "PRODUCT" ? "Ürün" : "İşlem";

    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
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
              <TableHead>Detaylar</TableHead>
              <TableHead>Notlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components && components.length > 0 ? (
              components
                .sort((a, b) => a.sequence_order - b.sequence_order)
                .map((component) => (
                  <TableRow key={component.id}>
                    <TableCell>{component.sequence_order}</TableCell>
                    <TableCell>{renderComponentType(component)}</TableCell>
                    <TableCell>{renderComponentDetails(component)}</TableCell>
                    <TableCell>
                      {component.quantity !== null ? component.quantity : "-"}
                    </TableCell>
                    <TableCell>
                      {component.details &&
                        component.details.type === "PROCESS" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="flex flex-col gap-1">
                                  <div>
                                    Machine:{" "}
                                    {
                                      component.details.process_config
                                        .machine_type
                                    }
                                  </div>
                                  {component.details.process_config
                                    .axis_count && (
                                    <div>
                                      Axis:{" "}
                                      {
                                        component.details.process_config
                                          .axis_count
                                      }
                                    </div>
                                  )}
                                  {component.details.process_config
                                    .estimated_duration_minutes && (
                                    <div>
                                      Duration:{" "}
                                      {
                                        component.details.process_config
                                          .estimated_duration_minutes
                                      }{" "}
                                      min
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                    </TableCell>
                    <TableCell>{component.notes || "-"}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Bu reçetede henüz komponent bulunmamaktadır
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
