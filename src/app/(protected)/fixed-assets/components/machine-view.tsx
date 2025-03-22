import { Machine } from "@/types/manufacture";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { MachineCard } from "./machine-card";
import { MachineFilters } from "./machine-filters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { PaginationControl } from "@/components/ui/pagination-control";
import { ViewToggle } from "@/components/ui/view-toggle";

interface MachineViewProps {
  isLoading: boolean;
  error: Error | null;
  items: Machine[];
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
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Hata</AlertTitle>
        <AlertDescription>
          Demirbaş listesi yüklenirken bir hata oluştu: {error.message}
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
  const totalPages = Math.ceil(items.length / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <MachineFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>

      {view === "table" ? (
        <DataTable
          columns={columns}
          data={paginatedItems}
          currentPage={currentPage}
          pageCount={totalPages}
          onPageChange={onPageChange}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedItems.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
          {paginatedItems.length > 0 && (
            <div className="col-span-full">
              <PaginationControl
                currentPage={currentPage}
                totalItems={items.length}
                pageSize={pageSize}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}

      {items.length === 0 && !isLoading && (
        <div className="text-center py-10 text-muted-foreground">
          Arama kriterlerine uygun demirbaş bulunamadı.
        </div>
      )}
    </div>
  );
}
