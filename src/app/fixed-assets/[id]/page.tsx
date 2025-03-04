"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings2,
  Tag,
  Calendar,
  Save,
  Undo,
  Edit,
  Trash,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Machine,
  MachineStatus,
  MachineType,
  AxisCount,
  needsMaintenance,
} from "@/types/manufacture";
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
import {
  useMachine,
  useUpdateMachine,
  useDeleteMachine,
} from "@/hooks/useMachines";

export default function MachineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: machine, isLoading, error } = useMachine(params.id as string);
  const updateMachine = useUpdateMachine();
  const deleteMachine = useDeleteMachine();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMachine, setEditedMachine] = useState<Machine | null>(null);

  useEffect(() => {
    if (machine) {
      setEditedMachine(machine);
    }
  }, [machine]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  if (error || !machine || !editedMachine) {
    return (
      <div className="text-center text-destructive">
        Demirbaş yüklenirken bir hata oluştu.
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteMachine.mutateAsync(machine.id);
      toast.success("Demirbaş başarıyla silindi");
      router.back();
    } catch (error) {
      toast.error("Demirbaş silinirken bir hata oluştu");
    }
  };

  const handleEdit = () => {
    setEditedMachine(machine);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedMachine(machine);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateMachine.mutateAsync(editedMachine);
      setIsEditing(false);
      router.refresh();
      toast.success("Demirbaş başarıyla güncellendi");
    } catch (error) {
      toast.error("Demirbaş güncellenirken bir hata oluştu");
    }
  };

  const requiresMaintenance = needsMaintenance(machine);

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title={isEditing ? "Demirbaş Düzenle" : "Demirbaş Detayları"}
        description={
          isEditing
            ? "Demirbaş bilgilerini düzenleyin"
            : "Demirbaş bilgilerini görüntüleyin"
        }
        showBackButton
        action={
          isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <Undo className="h-4 w-4 mr-2" />
                İptal
              </Button>
              <Button onClick={handleSave} disabled={updateMachine.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Kaydet
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash className="h-4 w-4 mr-2" />
                    Sil
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Demirbaşı silmek istediğinize emin misiniz?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Bu işlem geri alınamaz. Bu demirbaş kalıcı olarak
                      silinecektir.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sil
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
          )
        }
      />

      {requiresMaintenance && (
        <div className="bg-destructive/10 border-destructive/20 border rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div className="text-destructive">
            <p className="font-semibold">Bakım Gerekli</p>
            <p className="text-sm">
              Bu makine için planlı bakım zamanı gelmiştir.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {/* Basic Info Section */}
        <div className="grid gap-4 p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Temel Bilgiler</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="machine_code">Demirbaş Kodu</Label>
              {isEditing ? (
                <Input
                  id="machine_code"
                  value={editedMachine.machine_code}
                  onChange={(e) =>
                    setEditedMachine({
                      ...editedMachine,
                      machine_code: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {machine.machine_code}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="machine_type">Makine Tipi</Label>
              {isEditing ? (
                <Select
                  value={editedMachine.machine_type}
                  onValueChange={(value: MachineType) =>
                    setEditedMachine({
                      ...editedMachine,
                      machine_type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MachineType.PROCESSING_CENTER}>
                      İşleme Merkezi
                    </SelectItem>
                    <SelectItem value={MachineType.CNC_TORNA}>
                      CNC Torna Merkezi
                    </SelectItem>
                    <SelectItem value={MachineType.CNC_KAYAR_OTOMAT}>
                      CNC Kayar Otomat
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 w-fit"
                >
                  <Settings2 className="h-3 w-3" />
                  {machine.machine_type}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Durum</Label>
              {isEditing ? (
                <Select
                  value={editedMachine.status}
                  onValueChange={(value: MachineStatus) =>
                    setEditedMachine({
                      ...editedMachine,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MachineStatus.AVAILABLE}>
                      Müsait
                    </SelectItem>
                    <SelectItem value={MachineStatus.IN_USE}>
                      Kullanımda
                    </SelectItem>
                    <SelectItem value={MachineStatus.MAINTENANCE}>
                      Bakımda
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant={
                    machine.status === MachineStatus.AVAILABLE
                      ? "default"
                      : machine.status === MachineStatus.MAINTENANCE
                      ? "destructive"
                      : "secondary"
                  }
                  className="flex items-center gap-1 w-fit"
                >
                  <Tag className="h-3 w-3" />
                  {machine.status === MachineStatus.AVAILABLE
                    ? "Müsait"
                    : machine.status === MachineStatus.MAINTENANCE
                    ? "Bakımda"
                    : "Kullanımda"}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="axis_count">Eksen Sayısı</Label>
              {isEditing ? (
                <Select
                  value={editedMachine.axis_count || ""}
                  onValueChange={(value: AxisCount) =>
                    setEditedMachine({
                      ...editedMachine,
                      axis_count: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AxisCount).map((axis) => (
                      <SelectItem key={axis} value={axis}>
                        {axis}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {machine.axis_count || "Belirtilmemiş"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="grid gap-4 p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Teknik Özellikler</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">Marka</Label>
              {isEditing ? (
                <Input
                  id="brand"
                  value={editedMachine.brand || ""}
                  onChange={(e) =>
                    setEditedMachine({
                      ...editedMachine,
                      brand: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {machine.brand || "Belirtilmemiş"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              {isEditing ? (
                <Input
                  id="model"
                  value={editedMachine.model || ""}
                  onChange={(e) =>
                    setEditedMachine({
                      ...editedMachine,
                      model: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {machine.model || "Belirtilmemiş"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturing_year">Üretim Yılı</Label>
              {isEditing ? (
                <Input
                  id="manufacturing_year"
                  type="date"
                  value={
                    editedMachine.manufacturing_year
                      ? new Date(editedMachine.manufacturing_year)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditedMachine({
                      ...editedMachine,
                      manufacturing_year: e.target.value
                        ? new Date(e.target.value).toISOString().split("T")[0]
                        : null,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {machine.manufacturing_year
                    ? format(
                        new Date(machine.manufacturing_year),
                        "dd MMM yyyy",
                        {
                          locale: tr,
                        }
                      )
                    : "Belirtilmemiş"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serial_number">Seri Numarası</Label>
              {isEditing ? (
                <Input
                  id="serial_number"
                  value={editedMachine.serial_number || ""}
                  onChange={(e) =>
                    setEditedMachine({
                      ...editedMachine,
                      serial_number: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {machine.serial_number || "Belirtilmemiş"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Maintenance Info */}
        <div className="grid gap-4 p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Bakım Bilgileri</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maintenance_interval">Bakım Aralığı (Gün)</Label>
              {isEditing ? (
                <Input
                  id="maintenance_interval"
                  type="number"
                  value={editedMachine.maintenance_interval}
                  onChange={(e) =>
                    setEditedMachine({
                      ...editedMachine,
                      maintenance_interval: parseInt(e.target.value),
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {machine.maintenance_interval} gün
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_maintenance_date">Son Bakım Tarihi</Label>
              {isEditing ? (
                <Input
                  id="last_maintenance_date"
                  type="date"
                  value={
                    editedMachine.last_maintenance_date
                      ? new Date(editedMachine.last_maintenance_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditedMachine({
                      ...editedMachine,
                      last_maintenance_date: e.target.value
                        ? new Date(e.target.value).toISOString().split("T")[0]
                        : null,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {machine.last_maintenance_date
                    ? format(
                        new Date(machine.last_maintenance_date),
                        "dd MMM yyyy",
                        { locale: tr }
                      )
                    : "Belirtilmemiş"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_maintenance_date">
                Sonraki Bakım Tarihi
              </Label>
              <p className="text-sm text-muted-foreground">
                {machine.next_maintenance_date
                  ? format(
                      new Date(machine.next_maintenance_date),
                      "dd MMM yyyy",
                      {
                        locale: tr,
                      }
                    )
                  : "Belirtilmemiş"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenance_notes">Bakım Notları</Label>
              {isEditing ? (
                <Textarea
                  id="maintenance_notes"
                  value={editedMachine.maintenance_notes || ""}
                  onChange={(e) =>
                    setEditedMachine({
                      ...editedMachine,
                      maintenance_notes: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {machine.maintenance_notes || "Not bulunmuyor"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid gap-4 p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Ek Bilgiler</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={editedMachine.description || ""}
                  onChange={(e) =>
                    setEditedMachine({
                      ...editedMachine,
                      description: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {machine.description || "Açıklama bulunmuyor"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
