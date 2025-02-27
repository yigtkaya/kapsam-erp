"use client";

import { BOMComponent, BOMResponse } from "@/types/manufacture";
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
  Layers,
  Link,
  Trash2,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AddComponentDialog } from "./add-component-dialog";
import { useComponents, useDeleteComponent } from "@/hooks/useComponents";
import { useParams, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function ComponentTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Skeleton items */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-lg border"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}

          <div className="mt-6">
            <Skeleton className="h-10 w-full mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DeleteComponentButton({
  component,
  bomId,
}: {
  component: BOMComponent;
  bomId: number;
}) {
  const deleteComponent = useDeleteComponent();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Komponenti Sil</AlertDialogTitle>
          <AlertDialogDescription>
            Bu komponenti silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteComponent.mutate({
                componentId: component.id,
                bomId,
              })
            }
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ComponentsTable() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const {
    data: components,
    isLoading,
    error,
  } = useComponents(Number(params.id));

  if (isLoading) {
    return <ComponentTableSkeleton />;
  }

  const renderComponentType = (component: BOMComponent) => {
    const type = component.component_type;
    const variant = type === "Product Component" ? "default" : "secondary";
    const label = type === "Product Component" ? "Ürün" : "İşlem";

    return <Badge variant={variant}>{label}</Badge>;
  };

  // Group components by sequence order to visualize the flow
  const sortedComponents = [...components].sort(
    (a, b) => a.sequence_order - b.sequence_order
  );

  // the name of the process and code is in the process_config of the process component and in product component its in the product variable

  function getComponentName(component: BOMComponent): string {
    if (component.component_type === "Product Component") {
      return (
        component.product_component?.product?.product_name ?? "Unknown Product"
      );
    } else if (component.component_type === "Process Component") {
      return (
        component.process_component?.process_config?.process_name ??
        "Unknown Process"
      );
    } else {
      return "Unknown Component";
    }
  }

  const renderComponentDetails = (component: BOMComponent) => {
    if (component.component_type === "Product Component") {
      const productComponent = component.product_component;
      return (
        <div className="space-y-2 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Ürün Kodu
              </p>
              <p className="font-mono">
                {productComponent?.product?.product_code || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Miktar
              </p>
              <p className="font-mono">{component.quantity || "-"}</p>
            </div>
            <div>
              <Link
                href={`/boms/details/${productComponent?.active_bom_id}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Aktif Reçete Numarası
              </Link>
              <p className="font-mono">
                {productComponent?.active_bom_id || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Notlar
              </p>
              <p className="text-sm">{component.notes || "-"}</p>
            </div>
          </div>
        </div>
      );
    } else if (component.component_type === "Process Component") {
      const processComponent = component.process_component;
      return (
        <div className="space-y-2 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                İşlem Kodu
              </p>
              <p className="font-mono">
                {processComponent?.process_config?.process_code || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Makine Tipi
              </p>
              <p>{processComponent?.process_config?.machine_type || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Eksen Sayısı
              </p>
              <p>{processComponent?.process_config?.axis_count || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Tahmini Süre (dk)
              </p>
              <p className="font-mono">
                {processComponent?.process_config?.estimated_duration_minutes ||
                  "-"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">
                Notlar
              </p>
              <p className="text-sm">{component.notes || "-"}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>Komponentler</CardTitle>
            {isEditMode && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Pencil className="h-3 w-3" />
                <span>Düzenleme Modu</span>
              </Badge>
            )}
          </div>
          <AddComponentDialog bomId={Number(params.id)} />
        </div>
        <CardDescription>
          Bu reçetede bulunan tüm komponentlerin listesi
          {isEditMode && " - Düzenleme modunda komponentleri silebilirsiniz"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {components.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Henüz Komponent Eklenmemiş
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Bu reçeteye henüz hiç komponent eklenmemiş. "Komponent Ekle"
              butonunu kullanarak proses veya ürün ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  <span>
                    Ürünler:{" "}
                    {
                      components.filter(
                        (c: BOMComponent) =>
                          c.component_type === "Product Component"
                      ).length
                    }
                  </span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Cog className="h-3 w-3" />
                  <span>
                    İşlemler:{" "}
                    {
                      components.filter(
                        (c: BOMComponent) =>
                          c.component_type === "Process Component"
                      ).length
                    }
                  </span>
                </Badge>
              </div>

              {/* Process Flow Visualization */}
              {sortedComponents.length > 0 && (
                <div className="grid gap-4">
                  {sortedComponents.map((component, index) => (
                    <Collapsible key={component.id}>
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                          <div
                            className={cn(
                              "flex items-center justify-center w-10 h-10 rounded-full border-2",
                              component.component_type === "Product Component"
                                ? "bg-blue-100 border-blue-300 text-blue-700"
                                : "bg-green-100 border-green-300 text-green-700"
                            )}
                          >
                            {component.component_type ===
                            "Product Component" ? (
                              <Package className="h-5 w-5" />
                            ) : (
                              <Cog className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {getComponentName(component)}
                              </p>
                              {renderComponentType(component)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Sıra: {component.sequence_order}
                            </p>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="relative">
                          <div className="absolute top-4 right-4">
                            <DeleteComponentButton
                              component={component}
                              bomId={Number(params.id)}
                            />
                          </div>
                          {renderComponentDetails(component)}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </div>

            <Accordion
              type="single"
              collapsible
              className="mb-4"
              defaultValue="details"
            >
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
                          <TableCell>
                            {renderComponentType(component)}
                          </TableCell>
                          {/* stock code of the product and bom id */}
                          <TableCell>{getComponentName(component)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </CardContent>
    </Card>
  );
}
