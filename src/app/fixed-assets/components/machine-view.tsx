import { PaginationControl } from "@/components/ui/pagination-control";
import { ViewToggle } from "@/components/ui/view-toggle";
import { Machine } from "@/types/manufacture";
import { MachineCardSkeleton, MachineCard } from "./machine-card";
import { MachineFilters } from "./machine-filters";
import { MachineTable } from "./machine-table";

interface MachineViewProps {
  isLoading: boolean;
  error: unknown;
  items: Machine[];
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

export function MachineView({
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
}: MachineViewProps) {
  const start = currentPage * pageSize;
  const currentItems = items.slice(start, start + pageSize);

  return (
    <div className="space-y-6">
      {!isLoading && !error && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <MachineFilters
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
          Demirbaşlar yüklenirken bir hata oluştu.
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <MachineCardSkeleton key={index} />
                ))}
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentItems.map((machine) => (
                <MachineCard key={machine.id} machine={machine} />
              ))}
            </div>
          ) : (
            <MachineTable machines={currentItems} />
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
            ? "Aramanızla eşleşen demirbaş bulunamadı."
            : "Henüz demirbaş bulunmuyor."}
        </div>
      )}
    </div>
  );
}
