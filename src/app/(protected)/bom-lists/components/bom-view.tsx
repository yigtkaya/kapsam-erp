"use client";

import { BOM } from "@/types/manufacture";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { BOMCard } from "./bom-card";
import { BOMFilters } from "./bom-filters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { PaginationControl } from "@/components/ui/pagination-control";
import { ViewToggle } from "@/components/ui/view-toggle";
import { Suspense } from "react";

interface BOMViewProps {
  isLoading: boolean;
  error: Error | null;
  items: BOM[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  view: "grid" | "table";
  onViewChange: (value: "grid" | "table") => void;
  currentPage: number;
  onPageChange: (value: number) => void;
  pageSize: number;
}

// Separate DataTable view component for Suspense
function DataTableView({
  items,
  currentPage,
  pageSize,
}: {
  items: BOM[];
  currentPage: number;
  pageSize: number;
}) {
  return (
    <DataTable
      columns={columns}
      data={items}
      rowClassName="cursor-pointer hover:bg-accent"
      onRowClick={(row: BOM) => {
        window.location.href = `/bom-lists/${row.id}`;
      }}
    />
  );
}

// Grid view component for better organization
function GridView({
  items,
  currentPage,
  pageSize,
  onPageChange,
  totalItems,
}: {
  items: BOM[];
  currentPage: number;
  pageSize: number;
  onPageChange: (value: number) => void;
  totalItems: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((bom) => (
        <BOMCard key={bom.id} bom={bom} />
      ))}
      {items.length > 0 && (
        <div className="col-span-full">
          <PaginationControl
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

export function BOMView({
  isLoading,
  error,
  items,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  view,
  onViewChange,
  currentPage,
  onPageChange,
  pageSize,
}: BOMViewProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Hata</AlertTitle>
        <AlertDescription>
          Ürün ağacı listesi yüklenirken bir hata oluştu: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const startIndex = currentPage * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <BOMFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>

      {view === "table" ? (
        <Suspense
          fallback={
            <div className="py-8 text-center text-muted-foreground">
              Loading table view...
            </div>
          }
        >
          <DataTableView
            items={paginatedItems}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        </Suspense>
      ) : (
        <Suspense
          fallback={
            <div className="py-8 text-center text-muted-foreground">
              Loading grid view...
            </div>
          }
        >
          <GridView
            items={paginatedItems}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={onPageChange}
            totalItems={items.length}
          />
        </Suspense>
      )}

      {items.length === 0 && !isLoading && (
        <div className="text-center py-10 text-muted-foreground">
          Arama kriterlerine uygun ürün ağacı bulunamadı.
        </div>
      )}
    </div>
  );
}
