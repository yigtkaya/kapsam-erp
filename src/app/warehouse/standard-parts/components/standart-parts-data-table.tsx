"use client";

import React, { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { standardPartsColumns } from "./columns";
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

// This component demonstrates how to fetch products (here, considered as "standard parts")
export default function StandardPartsDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
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
  const { data, isLoading, error } = useProducts({
    category: "HAMMADDE",
    product_type: "STANDARD_PART",
    page: pageIndex + 1,
    page_size: pageSize,
    product_code: debouncedProductCode,
    product_name: debouncedProductName,
  });

  const table = useReactTable({
    data: data?.results ?? [],
    columns: standardPartsColumns,
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
                columnCount={standardPartsColumns.length}
              />
            ) : data?.results && data.results.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={standardPartsColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Ürün bulunamadı
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
