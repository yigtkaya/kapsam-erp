"use client";

import React, { useState } from "react";
import { useRawMaterials } from "@/hooks/useRawMaterials";
import { RawMaterial } from "@/types/inventory";
import { rawMaterialsColumns } from "./columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { Input } from "@/components/ui/input";
import { useReactTable } from "@tanstack/react-table";

export default function RawMaterialsDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useRawMaterials({
    category: "HAMMADDE",
    page: pageIndex + 1,
    page_size: pageSize,
  });

  const table = useReactTable({
    data: data?.results ?? [],
    columns: rawMaterialsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    pageCount: data ? Math.ceil(data.count / pageSize) : -1,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex,
          pageSize,
        });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      }
    },
    manualPagination: true,
  });

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
        Error loading raw materials: {error.message}
      </div>
    );
  }

  if (!data?.results || data.results.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No raw materials found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-muted/200 shadow-sm bg-background">
        <Table>
          <TableHeader className="bg-muted/90">
            <TableRow>
              {table.getFlatHeaders().map((header) => (
                <TableHead key={header.id} className="text-center">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/90">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
