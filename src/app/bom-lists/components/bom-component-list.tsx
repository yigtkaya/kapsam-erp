import { BOMComponent } from "@/types/manufacture";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useUpdateBOMComponents } from "@/hooks/useBOMs";
import { toast } from "sonner";

interface BOMComponentListProps {
  bomId: number;
  components: BOMComponent[];
}

export function BOMComponentList({ bomId, components }: BOMComponentListProps) {
  const { mutate: updateComponents, isPending } = useUpdateBOMComponents();

  const handleDelete = (componentId: number) => {
    const updatedComponents = components.filter((c) => c.id !== componentId);
    updateComponents(
      { id: bomId, components: updatedComponents },
      {
        onSuccess: () => {
          toast.success("Bileşen başarıyla silindi.");
        },
        onError: () => {
          toast.error("Bileşen silinirken bir hata oluştu.");
        },
      }
    );
  };

  if (components.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Henüz bileşen eklenmemiş.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sıra</TableHead>
          <TableHead>Ürün Kodu</TableHead>
          <TableHead>Ürün Adı</TableHead>
          <TableHead>Miktar</TableHead>
          <TableHead>Temin Süresi (Gün)</TableHead>
          <TableHead>Notlar</TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {components.map((component) => (
          <TableRow key={component.id}>
            <TableCell>{component.sequence_order}</TableCell>
            <TableCell>{component.product_code}</TableCell>
            <TableCell>{component.product_name}</TableCell>
            <TableCell>{component.quantity}</TableCell>
            <TableCell>{component.lead_time_days || "-"}</TableCell>
            <TableCell>{component.notes || "-"}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(component.id)}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
