import { Product } from "@/types/inventory";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { ProductFilters } from "./product-filters";
import { ProductTable } from "./product-table";
import { ViewToggle } from "./view-toggle";
import { PaginationControl } from "./pagination-control";

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

  return (
    <div className="space-y-6">
      {!isLoading && !error && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
          />
          <ViewToggle view={view} onViewChange={onViewChange} />
        </div>
      )}

      {error ? (
        <div className="text-center text-destructive">
          Ürünler yüklenirken bir hata oluştu.
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <ProductTable products={currentItems} />
          )}

          {!isLoading && items.length > 0 && (
            <PaginationControl
              currentPage={currentPage}
              totalItems={items.length}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          )}
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="text-center text-muted-foreground">
          {searchQuery
            ? "Aramanızla eşleşen ürün bulunamadı."
            : "Henüz ürün bulunmuyor."}
        </div>
      )}
    </div>
  );
}
