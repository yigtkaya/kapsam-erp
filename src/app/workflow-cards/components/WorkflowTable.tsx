"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkflowStatus } from "@/types/manufacture";
import {
  WorkflowTableRow,
  ProcessTableRow,
} from "../hooks/useWorkflowTableData";
import { useRouter } from "next/navigation";

const columns: ColumnDef<WorkflowTableRow>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            row.getToggleExpandedHandler();
          }}
          className="p-0 w-6 h-6"
        >
          {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
        </Button>
      );
    },
  },
  {
    accessorKey: "product_code",
    header: "Ürün Kodu",
  },
  {
    accessorKey: "product_name",
    header: "Ürün Adı",
  },
  {
    accessorKey: "workflow_id",
    header: "İş Akışı ID",
  },
  {
    accessorKey: "version",
    header: "Versiyon",
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => {
      const status = row.getValue("status") as WorkflowStatus;
      let variant: "default" | "destructive" | "outline" | "secondary" =
        "default";

      if (status === WorkflowStatus.ACTIVE) {
        variant = "secondary";
      } else if (status === WorkflowStatus.DRAFT) {
        variant = "outline";
      } else {
        variant = "destructive";
      }

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

const processColumns = [
  { id: "id", header: "ID" },
  { id: "operation_no", header: "Operasyon No" },
  { id: "operation_name", header: "Operasyon Adı" },
  { id: "machine_type", header: "Makine Tipi" },
  { id: "version", header: "Versiyon" },
  { id: "actions", header: "İşlemler" },
] as const;

interface WorkflowTableProps {
  data: WorkflowTableRow[];
}

export function WorkflowTable({ data }: WorkflowTableProps) {
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      rowSelection,
      expanded,
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  const renderProcessCell = (process: ProcessTableRow, columnId: string) => {
    if (columnId === "actions") {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/process/${process.id}`)}
        >
          Process Git
        </Button>
      );
    }
    return process[columnId as keyof ProcessTableRow];
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() =>
                      router.push(`/workflow-cards/${row.original.workflow_id}`)
                    }
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-0">
                        <div className="bg-muted/50 p-2">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {processColumns.map((column) => (
                                  <TableHead key={column.id}>
                                    {column.header}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.original.processes.map((process) => (
                                <TableRow key={process.id}>
                                  {processColumns.map((column) => (
                                    <TableCell key={column.id}>
                                      {renderProcessCell(process, column.id)}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} satırdan{" "}
          {table.getFilteredRowModel().rows.length} satır seçildi.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Önceki
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  );
}
