"use client";

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
import { Plus, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BOMComponentListProps {
  components: BOMComponent[];
  bomId: string;
}

export function BOMComponentList({ components, bomId }: BOMComponentListProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleEdit = (componentId: string) => {
    setIsEditing(componentId);
  };

  const handleDelete = async (componentId: string) => {
    try {
      // TODO: Implement delete functionality
      toast.success("Component deleted");
    } catch (error) {
      toast.error("Failed to delete component");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Components</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Component
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sequence</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map((component) => (
            <TableRow key={component.id}>
              <TableCell>{component.sequence_order}</TableCell>
              <TableCell>{component.product}</TableCell>
              <TableCell>{component.quantity}</TableCell>
              <TableCell>{component.notes || "-"}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(component.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(component.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {components.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No components found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
