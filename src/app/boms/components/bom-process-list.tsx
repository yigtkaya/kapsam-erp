"use client";

import { BOMComponent, BOMProcessConfig } from "@/types/manufacture";
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

interface BOMProcessListProps {
  processes: BOMComponent[];
  bomId: string;
}

export function BOMProcessList({ processes, bomId }: BOMProcessListProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleEdit = (processId: string) => {
    setIsEditing(processId);
  };

  const handleDelete = async (processId: string) => {
    try {
      // TODO: Implement delete functionality
      toast.success("Process deleted");
    } catch (error) {
      toast.error("Failed to delete process");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Manufacturing Processes</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Process
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sequence</TableHead>
            <TableHead>Process</TableHead>
            <TableHead>Duration (min)</TableHead>
            <TableHead>Raw Material</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((process) => (
            <TableRow key={process.id}>
              <TableCell>{process.sequence_order}</TableCell>
              <TableCell>{process.process_config}</TableCell>
              <TableCell>
                {(process.process_config as unknown as BOMProcessConfig)
                  ?.estimated_duration_minutes || "-"}
              </TableCell>
              <TableCell>{process.raw_material || "-"}</TableCell>
              <TableCell>{process.notes || "-"}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(process.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(process.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {processes.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No processes found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
