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
import { toast } from "sonner";
import {
  useUpdateComponent,
  useDeleteComponent,
  useComponents,
} from "@/hooks/useComponents";
import { Skeleton } from "@/components/ui/skeleton";

interface BOMComponentListProps {
  bomId: number;
  components: BOMComponent[];
}

export function BOMComponentList({ bomId, components }: BOMComponentListProps) {
  const { mutate: updateComponents, isPending } = useUpdateComponent();
  const { mutate: deleteBOMComponent, isPending: isDeleting } =
    useDeleteComponent();
  const { data: liveComponents, isLoading } = useComponents(bomId);

  const handleDelete = (componentId: number) => {
    deleteBOMComponent({ bomId, componentId });
  };

  // Use live components data if available, otherwise fall back to prop
  const displayComponents = liveComponents || components;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!displayComponents?.length) {
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
        {displayComponents.map((component: BOMComponent) => (
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
                className="hover:text-red-600 transition-colors"
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
