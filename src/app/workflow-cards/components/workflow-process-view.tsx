import { WorkflowProcess } from "@/types/manufacture";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { PaginationControl } from "@/components/ui/pagination-control";
import { ViewToggle } from "@/components/ui/view-toggle";
import { WorkflowProcessFilters } from "./workflow-process-filters";
import { WorkflowProcessCard } from "./workflow-process-card";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface WorkflowProcessViewProps {
  isLoading: boolean;
  error: Error | null;
  items: WorkflowProcess[];
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

export function WorkflowProcessView({
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
}: WorkflowProcessViewProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Hata</AlertTitle>
        <AlertDescription>
          İş akışı işlemleri yüklenirken bir hata oluştu: {error.message}
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

  // Group processes by product
  const groupedProcesses = paginatedItems.reduce((groups, process) => {
    const productId = process.product_details?.id || "unknown";
    const productName =
      process.product_details?.product_name || "Unknown Product";

    if (!groups[productId]) {
      groups[productId] = {
        productName,
        processes: [],
      };
    }

    groups[productId].processes.push(process);
    return groups;
  }, {} as Record<string | number, { productName: string; processes: WorkflowProcess[] }>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <WorkflowProcessFilters
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
        <div className="space-y-8">
          {Object.entries(groupedProcesses).map(([productId, group]) => (
            <div key={productId} className="space-y-4">
              <h2 className="text-2xl font-semibold">{group.productName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.processes.map((process) => (
                  <WorkflowProcessCard key={process.id} process={process} />
                ))}
              </div>
            </div>
          ))}
          {paginatedItems.length > 0 && (
            <PaginationControl
              currentPage={currentPage}
              totalItems={items.length}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          )}
        </div>
      )}

      {items.length === 0 && !isLoading && (
        <div className="text-center py-10 text-muted-foreground">
          Arama kriterlerine uygun iş akışı işlemi bulunamadı.
        </div>
      )}
    </div>
  );
}
