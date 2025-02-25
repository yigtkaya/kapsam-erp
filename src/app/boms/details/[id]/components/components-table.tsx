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
import {
  Info,
  Cog,
  Package,
  ArrowRight,
  Clock,
  Settings,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ComponentsTableProps {
  components: BOMComponent[];
}

export function ComponentsTable({ components }: ComponentsTableProps) {
  const renderComponentDetails = (component: BOMComponent) => {
    if (!component.details) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-red-500">Eksik detaylar</span>
          <span className="text-sm text-muted-foreground">
            Komponent verisi eksik
          </span>
        </div>
      );
    }

    if (component.details.type === "PRODUCT") {
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{component.details.product.name}</span>
          </div>
          <span className="text-sm text-muted-foreground ml-6">
            {component.details.product.product_code}
          </span>
          <span className="text-sm text-muted-foreground ml-6 mt-1">
            Tür: {component.details.product.product_type}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Cog className="h-4 w-4 text-green-500" />
            <span className="font-medium">
              {component.details.process_config.process_name}
            </span>
          </div>
          <span className="text-sm text-muted-foreground ml-6">
            {component.details.process_config.process_code}
          </span>
          <div className="flex items-center gap-1 mt-1 ml-6">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Tahmini Süre: {component.details.process_config.estimated_duration_minutes || "Belirtilmemiş"} dk
            </span>
          </div>
          {component.details.process_config.machine_type && (
            <div className="flex items-center gap-1 mt-1 ml-6">
              <Settings className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Makine Tipi: {component.details.process_config.machine_type}
              </span>
            </div>
          )}
          {component.details.raw_material && (
            <div className="flex items-center gap-1 mt-1 ml-6">
              <Layers className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Hammadde: {component.details.raw_material.name}
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

  // Group components by sequence order to visualize the flow
  const sortedComponents = [...components].sort((a, b) => a.sequence_order - b.sequence_order);

  // Helper function to safely get component name
  const getComponentName = (component: BOMComponent) => {
    if (!component.details) return "Bilinmeyen";

    if (component.component_type === "PRODUCT" && "product" in component.details) {
      return component.details.product.name;
    } else if (component.component_type === "PROCESS" && "process_config" in component.details) {
      return component.details.process_config.process_name;
    }

    return "Bilinmeyen";
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
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              <span>Ürünler: {components.filter(c => c.component_type === "PRODUCT").length}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Cog className="h-3 w-3" />
              <span>İşlemler: {components.filter(c => c.component_type === "PROCESS").length}</span>
            </Badge>
          </div>

          {/* Process Flow Visualization */}
          {sortedComponents.length > 0 && (
            <div className="py-4 px-2 border rounded-md bg-muted/20">
              <div className="flex flex-wrap items-center gap-2">
                {sortedComponents.map((component, index) => (
                  <div key={component.id} className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "flex items-center justify-center w-10 h-10 rounded-full border-2",
                              component.component_type === "PRODUCT"
                                ? "bg-blue-100 border-blue-300 text-blue-700"
                                : "bg-green-100 border-green-300 text-green-700"
                            )}
                          >
                            {component.component_type === "PRODUCT" ? (
                              <Package className="h-5 w-5" />
                            ) : (
                              <Cog className="h-5 w-5" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">
                            {getComponentName(component)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sıra: {component.sequence_order}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {index < sortedComponents.length - 1 && (
                      <ArrowRight className="h-4 w-4 mx-1 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="details">
            <AccordionTrigger>Detaylı Görünüm</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sıra</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead>Komponent</TableHead>
                    <TableHead>Notlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedComponents.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell className="font-medium">
                        {component.sequence_order}
                      </TableCell>
                      <TableCell>{renderComponentType(component)}</TableCell>
                      <TableCell>{renderComponentDetails(component)}</TableCell>
                      <TableCell>
                        {component.notes ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 cursor-help">
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">Not</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{component.notes}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
