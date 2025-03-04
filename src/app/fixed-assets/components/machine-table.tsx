"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Machine } from "@/types/manufacture";
import { Badge } from "@/components/ui/badge";
import { Settings2, Tag, BarChart4 } from "lucide-react";
import Link from "next/link";

interface MachineTableProps {
  machines: Machine[];
}

export function MachineTable({ machines }: MachineTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Demirbaş Adı</TableHead>
            <TableHead>Demirbaş Kodu</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Tip</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Açıklama</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {machines.map((machine) => (
            <TableRow key={machine.id}>
              <TableCell>
                <Link
                  href={`/fixed-assets/${machine.id}`}
                  className="hover:underline"
                >
                  {machine.machine_name}
                </Link>
              </TableCell>
              <TableCell>{machine.machine_code}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="flex w-fit items-center gap-1"
                >
                  <Settings2 className="h-3 w-3" />
                  {machine.status || "Durum Belirtilmemiş"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="flex w-fit items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {machine.machine_type || "Tip Belirtilmemiş"}
                </Badge>
              </TableCell>
              <TableCell>
                {machine.category_display && (
                  <Badge
                    variant="outline"
                    className="flex w-fit items-center gap-1"
                  >
                    <BarChart4 className="h-3 w-3" />
                    {machine.category_display}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="max-w-[300px]">
                <span className="line-clamp-2">
                  {machine.description || "Açıklama bulunmuyor"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
