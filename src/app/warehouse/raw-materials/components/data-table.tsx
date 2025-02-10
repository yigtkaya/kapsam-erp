import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface Column {
  header: string;
  accessor: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[] | null | undefined;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DataTable({
  columns,
  data,
  page,
  pageSize,
  totalPages,
  onPageChange,
}: DataTableProps) {
  if (!data) {
    return <div className="text-center py-4">Loading data...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-4">No data available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} className="border px-4 py-2 bg-gray-50">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.accessor} className="border px-4 py-2">
                    {row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && onPageChange(page - 1)}
              className={
                page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            // Show first page, current page, last page, and pages around current page
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= page - 1 && pageNumber <= page + 1)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => onPageChange(pageNumber)}
                    isActive={page === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (pageNumber === page - 2 || pageNumber === page + 2) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPages && onPageChange(page + 1)}
              className={
                page >= totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
