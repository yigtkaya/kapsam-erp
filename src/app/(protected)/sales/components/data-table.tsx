"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  OnChangeFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SalesOrderItem } from "@/types/sales";

interface DataTableProps {
  data: SalesOrderItem[];
  columns: ColumnDef<SalesOrderItem>[];
  isLoading: boolean;
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onSortChange?: (sortKey: string) => void;
}

export function DataTable({
  data,
  columns,
  isLoading,
  currentPage,
  pageCount,
  onPageChange,
  onSortChange,
}: DataTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);

  // Custom sorting handler that also notifies parent component
  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    // First, update the local state
    setSorting(updaterOrValue);

    // Then determine the new sorting state to notify parent
    const newSorting =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting)
        : updaterOrValue;

    // Only notify parent if there's a sort to report
    if (newSorting.length > 0 && onSortChange) {
      const sortKey = `${newSorting[0].id}_${
        newSorting[0].desc ? "desc" : "asc"
      }`;
      onSortChange(sortKey);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount,
    onSortingChange: handleSortingChange,
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-200"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-gray-800 bg-gray-100 py-3"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="h-16">
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="h-8 w-full animate-pulse rounded bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-200"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-gray-800 bg-gray-100 py-3"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="group cursor-pointer transition-all duration-200 hover:bg-muted/50"
                  onClick={() =>
                    router.push(`/sales/${row.original.order_id}`, {
                      scroll: false,
                    })
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="transition-all duration-200"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sipariş kalemi bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}
