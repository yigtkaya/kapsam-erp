"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Save, X } from "lucide-react";
import { BOMComponent } from "@/types/manufacture";
import { useUpdateBOMComponents } from "@/hooks/useBOMs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";

interface BOMComponentsTableProps {
  initialComponents: BOMComponent[];
  bomId?: number; // Make bomId optional
}

export function BOMComponentsTable({
  initialComponents,
  bomId: propBomId,
}: BOMComponentsTableProps) {
  const [components, setComponents] =
    useState<BOMComponent[]>(initialComponents);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{
    quantity?: number;
    notes?: string;
  }>({});

  const router = useRouter();
  const { mutate: updateComponents, isPending } = useUpdateBOMComponents();

  // Use the bomId from props if provided
  const bomId = propBomId || Number(initialComponents[0]?.bom);

  const handleEdit = (component: BOMComponent) => {
    setEditingId(component.id);
    setEditValues({
      quantity: component.quantity,
      notes: component.notes,
    });
  };

  const handleSave = () => {
    if (editingId === null) return;

    const updatedComponents = components.map((component) =>
      component.id === editingId ? { ...component, ...editValues } : component
    );

    setComponents(updatedComponents);
    updateComponents(
      { id: bomId, components: updatedComponents },
      {
        onSuccess: () => {
          toast.success("Bileşen başarıyla güncellendi");
          setEditingId(null);
          setEditValues({});
          router.refresh();
        },
        onError: (error) => {
          toast.error(`Bileşen güncellenirken hata oluştu: ${error.message}`);
        },
      }
    );
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleDelete = (componentId: number) => {
    const updatedComponents = components.filter(
      (component) => component.id !== componentId
    );

    setComponents(updatedComponents);
    updateComponents(
      { id: bomId, components: updatedComponents },
      {
        onSuccess: () => {
          toast.success("Bileşen başarıyla silindi");
          router.refresh();
        },
        onError: (error) => {
          toast.error(`Bileşen silinirken hata oluştu: ${error.message}`);
        },
      }
    );
  };

  const handleInputChange = (
    field: "quantity" | "notes",
    value: string | number
  ) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: field === "quantity" ? Number(value) : value,
    }));
  };

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-medium">Bileşen Kodu</TableHead>
              <TableHead className="font-medium">Bileşen Adı</TableHead>
              <TableHead className="font-medium">Miktar</TableHead>
              <TableHead className="font-medium">Notlar</TableHead>
              <TableHead className="text-right font-medium">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p>Bu reçeteye henüz bileşen eklenmemiş</p>
                    <p className="text-sm">
                      Bileşen eklemek için sağ üstteki "Bileşen Ekle" butonunu
                      kullanın
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              components.map((component) => (
                <TableRow key={component.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {component.component_type === "PRODUCT"
                          ? (component.details as any).product.product_code
                          : (component.details as any).process_config
                              .process_code}
                      </Badge>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {component.component_type === "PRODUCT"
                          ? "Ürün"
                          : "Süreç"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {component.component_type === "PRODUCT"
                      ? (component.details as any).product.name
                      : (component.details as any).process_config.process_name}
                  </TableCell>
                  <TableCell>
                    {editingId === component.id ? (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editValues.quantity || ""}
                        onChange={(e) =>
                          handleInputChange("quantity", e.target.value)
                        }
                        className="w-24"
                      />
                    ) : (
                      <span className="font-mono">
                        {component.quantity || "-"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === component.id ? (
                      <Input
                        type="text"
                        value={editValues.notes || ""}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        {component.notes || "-"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === component.id ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4 mr-1" />
                          İptal
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={isPending}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Kaydet
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(component)}
                          className="h-8 text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Düzenle
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Sil
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bileşeni silmek istediğinize emin misiniz?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu işlem geri alınamaz. Bu bileşen reçeteden
                                kalıcı olarak silinecektir.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(component.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
