"use client";

import React, { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { processProductsColumns } from "./columns";
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
  useReactTable,
} from "@tanstack/react-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { Input } from "@/components/ui/input";

export default function ProcessDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [debouncedProductCode, setDebouncedProductCode] = useState("");
  const [debouncedProductName, setDebouncedProductName] = useState("");

  // Extract column filter values
  const productCodeFilter =
    (columnFilters.find((f) => f.id === "product_code")?.value as string) || "";
  const productNameFilter =
    (columnFilters.find((f) => f.id === "product_name")?.value as string) || "";

  // Debounce effects
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProductCode(productCodeFilter);
    }, 500);
    return () => clearTimeout(handler);
  }, [productCodeFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProductName(productNameFilter);
    }, 500);
    return () => clearTimeout(handler);
  }, [productNameFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setPageIndex(0);
  }, [debouncedProductCode, debouncedProductName]);

  const { data, isLoading, error } = useProducts({
    product_type: "SEMI",
    category: "PROSES",
    page: pageIndex + 1,
    page_size: pageSize,
    product_code: debouncedProductCode,
    product_name: debouncedProductName,
  });

  const table = useReactTable({
    data: data?.results ?? [],
    columns: processProductsColumns,
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
    manualPagination: true,
    pageCount: data ? Math.ceil(data.count / pageSize) : -1,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      }
    },
  });

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
        Process products loading error: {error.message}
      </div>
    );
  }

  if (data?.results && data.results.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Process ürün bulunamadı.
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
                  <TableHead key={header.id} className="px-2 pb-4">
                    <div className="flex flex-col gap-2">
                      <div className="font-semibold text-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                      {header.column.getCanFilter() && (
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
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <DataTableSkeleton
                rowCount={pageSize}
                columnCount={processProductsColumns.length}
              />
            ) : data?.results && data.results.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={processProductsColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Process ürün bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/90">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
