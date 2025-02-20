"use client";

import { useBOM } from "@/hooks/useBOMs";
import { EditBOMForm } from "./edit-bom-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash } from "lucide-react";
import { format } from "date-fns";
import { BOMComponent } from "@/types/manufacture";
import { useState } from "react";

interface BOMDetailsProps {
  id: number;
}

export function BOMDetails({ id }: BOMDetailsProps) {
  const { data: bom, isLoading } = useBOM(id);
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!bom) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h3 className="text-lg font-semibold">BOM not found</h3>
        <p className="text-muted-foreground">
          The requested BOM could not be found.
        </p>
      </div>
    );
  }

  if (isEditing) {
    return <EditBOMForm initialData={bom} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">BOM Details</h1>
          <p className="text-muted-foreground">
            Product: {bom.product} | Version: {bom.version}
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge variant={bom.is_active ? "default" : "secondary"}>
                {bom.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Product Type
              </p>
              <p>{bom.product_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created At
              </p>
              <p>{format(new Date(bom.created_at), "PPP")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Modified
              </p>
              <p>{format(new Date(bom.modified_at), "PPP")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Components Table */}
      <Card>
        <CardHeader>
          <CardTitle>Components</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sequence</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bom.components.map((component: BOMComponent) => (
                  <TableRow key={component.id}>
                    <TableCell>{component.sequence_order}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {component.component_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {component.component_type === "PRODUCT"
                        ? component.product
                        : component.process_config}
                    </TableCell>
                    <TableCell>{component.quantity}</TableCell>
                    <TableCell>{component.notes || "-"}</TableCell>
                  </TableRow>
                ))}
                {bom.components.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No components found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
