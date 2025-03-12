import { WorkflowProcess } from "@/types/manufacture";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { PaginationControl } from "@/components/ui/pagination-control";
import { WorkflowProcessFilters } from "./workflow-process-filters";
import { WorkflowProcessCard } from "./workflow-process-card";
import { ViewToggle } from "@/components/ui/view-toggle";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WorkflowProcessViewProps {
  isLoading: boolean;
  error: Error | null;
  items: WorkflowProcess[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  currentPage: number;
  onPageChange: (value: number) => void;
  pageSize: number;
  view: "grid" | "table";
  onViewChange: (view: "grid" | "table") => void;
}

interface GroupState {
  [key: string]: boolean;
}

export function WorkflowProcessView({
  isLoading,
  error,
  items,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  currentPage,
  onPageChange,
  pageSize,
  view,
  onViewChange,
}: WorkflowProcessViewProps) {
  const [expandedGroups, setExpandedGroups] = useState<GroupState>({});

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

  const toggleGroup = (productId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <WorkflowProcessFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>

      {view === "grid" ? (
        <div className="space-y-8">
          {Object.entries(groupedProcesses).map(([productId, group]) => (
            <div key={productId} className="space-y-4">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between p-2 hover:bg-muted"
                onClick={() => toggleGroup(productId)}
              >
                <h2 className="text-2xl font-semibold">{group.productName}</h2>
                {expandedGroups[productId] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <div
                className={cn(
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                  "transition-all duration-200 ease-in-out origin-top",
                  expandedGroups[productId] ? "grid" : "hidden"
                )}
              >
                {group.processes.map((process) => (
                  <WorkflowProcessCard key={process.id} process={process} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedItems}
          currentPage={currentPage}
          pageCount={Math.ceil(items.length / pageSize)}
          onPageChange={onPageChange}
        />
      )}

      {items.length === 0 && !isLoading && (
        <div className="text-center py-10 text-muted-foreground">
          Arama kriterlerine uygun iş akışı işlemi bulunamadı.
        </div>
      )}
    </div>
  );
}
