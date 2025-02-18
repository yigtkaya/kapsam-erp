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
  Column,
  useReactTable,
  Row,
  Cell,
  HeaderGroup,
  Header,
} from "@tanstack/react-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DimensionFilter } from "./dimension-filter";

export default function RawMaterialsDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(50);

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
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-3 py-2 text-left min-w-[140px]"
                  >
                    {header.column.id === "select" && (
                      <div className="flex justify-center items-center p-1">
                        <Checkbox
                          className="h-4 w-4"
                          checked={table.getIsAllPageRowsSelected()}
                          onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                          }
                          aria-label="Select all"
                        />
                      </div>
                    )}
                    {["width", "height", "thickness", "diameter_mm"].includes(
                      header.column.id
                    ) && (
                      <DimensionFilter
                        column={header.column as Column<RawMaterial, number>}
                        label={
                          header.column.id === "width"
                            ? "Genişlik"
                            : header.column.id === "height"
                            ? "Yükseklik"
                            : header.column.id === "thickness"
                            ? "Kalınlık"
                            : "Çap (mm)"
                        }
                      />
                    )}
                    {["material_code", "material_name"].includes(
                      header.column.id
                    ) && (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-muted-foreground">
                            {header.column.id === "material_code"
                              ? "Malzeme Kodu"
                              : "Malzeme Adı"}
                          </span>
                        </div>
                        <Input
                          placeholder="Filtrele..."
                          value={
                            (header.column.getFilterValue() ?? "") as string
                          }
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
                          className="h-8"
                        />
                      </div>
                    )}
                    {header.column.id === "current_stock" && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Stok Miktarı
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              header.column.toggleSorting(
                                header.column.getIsSorted() === "asc"
                              )
                            }
                          >
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUpIcon className="h-4 w-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDownIcon className="h-4 w-4" />
                            ) : (
                              <ArrowUpIcon className="h-4 w-4 opacity-50" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    {header.column.id === "material_type" && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Malzeme Tipi
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              header.column.toggleSorting(
                                header.column.getIsSorted() === "asc"
                              )
                            }
                          >
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUpIcon className="h-4 w-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDownIcon className="h-4 w-4" />
                            ) : (
                              <ArrowUpIcon className="h-4 w-4 opacity-50" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    {header.column.id === "actions" && (
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          İşlemler
                        </span>
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
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
