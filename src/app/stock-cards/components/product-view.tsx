import { Product } from "@/types/inventory";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { ProductFilters } from "./product-filters";
import { ProductTable } from "./product-table";
import { ViewToggle } from "./view-toggle";
import { PaginationControl } from "./pagination-control";
import { Suspense } from "react";

interface ProductViewProps {
  isLoading: boolean;
  error: unknown;
  items: Product[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  view: "grid" | "table";
  onViewChange: (value: "grid" | "table") => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}

// Separate DataTable view component for Suspense
function DataTableView({ items }: { items: Product[] }) {
  return <ProductTable products={items} />;
}

// Grid view component for better organization
function GridView({
  items,
  currentPage,
  pageSize,
  onPageChange,
  totalItems,
}: {
  items: Product[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {items.length > 0 && (
        <PaginationControl
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}

export function ProductView({
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
}: ProductViewProps) {
  const start = currentPage * pageSize;
  const currentItems = items.slice(start, start + pageSize);

  if (error) {
    return (
      <div className="text-center text-destructive">
        Ürünler yüklenirken bir hata oluştu.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>

      <div className="space-y-4">
        {view === "table" ? (
          <Suspense
            fallback={
              <div className="py-8 text-center text-muted-foreground">
                Loading table view...
              </div>
            }
          >
            <DataTableView items={currentItems} />
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
              items={currentItems}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={onPageChange}
              totalItems={items.length}
            />
          </Suspense>
        )}

        {items.length === 0 && (
          <div className="text-center text-muted-foreground">
            {searchQuery
              ? "Aramanızla eşleşen ürün bulunamadı."
              : "Henüz ürün bulunmuyor."}
          </div>
        )}
      </div>
    </div>
  );
}
