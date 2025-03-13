import { WorkflowProcess } from "@/types/manufacture";
import { WorkflowProcessFilters } from "./workflow-process-filters";
import { WorkflowProcessCard } from "./workflow-process-card";
import { ViewToggle } from "@/components/ui/view-toggle";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface WorkflowProcessViewProps {
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
  isLoading?: boolean;
}

// Separate DataTable view component for Suspense
function DataTableView({
  items,
  currentPage,
  pageSize,
  onPageChange,
}: {
  items: WorkflowProcess[];
  currentPage: number;
  pageSize: number;
  onPageChange: (value: number) => void;
}) {
  return (
    <DataTable
      columns={columns}
      data={items}
      currentPage={currentPage}
      pageCount={Math.ceil(items.length / pageSize)}
      onPageChange={onPageChange}
    />
  );
}

// Grid view component for better organization
function GridView({
  groupedProcesses,
  expandedGroups,
  toggleGroup,
}: {
  groupedProcesses: Record<
    string | number,
    { productName: string; processes: WorkflowProcess[] }
  >;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (productId: string) => void;
}) {
  return (
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
  );
}

export function WorkflowProcessView({
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
  isLoading = false,
}: WorkflowProcessViewProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

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
    <div
      className={cn("space-y-4", isLoading && "opacity-70 pointer-events-none")}
    >
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
        <Suspense
          fallback={
            <div className="py-8 text-center text-muted-foreground">
              Loading table view...
            </div>
          }
        >
          <GridView
            groupedProcesses={groupedProcesses}
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
          />
        </Suspense>
      ) : (
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
            onPageChange={onPageChange}
          />
        </Suspense>
      )}

      {items.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          Arama kriterlerine uygun iş akışı işlemi bulunamadı.
        </div>
      )}
    </div>
  );
}
