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

interface ComponentsTableProps {
  components: BOMComponent[];
}

export function ComponentsTable({ components }: ComponentsTableProps) {
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
              <TableHead>Notlar</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components
              .sort((a, b) => a.sequence_order - b.sequence_order)
              .map((component) => (
                <TableRow key={component.id}>
                  <TableCell>{component.sequence_order}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{component.component_type}</Badge>
                  </TableCell>
                  <TableCell>
                    {component.component_type === "PRODUCT"
                      ? component.product
                      : component.process_config}
                  </TableCell>
                  <TableCell>{component.quantity}</TableCell>
                  <TableCell>{component.notes || "-"}</TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
