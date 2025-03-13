"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, Suspense, useCallback, useState } from "react";
import { WorkflowProcessView } from "./components/workflow-process-view";
import { useRouter } from "next/navigation";
import { useWorkflowProcesses } from "./hooks/use-workflow-hooks";

const PAGE_SIZE = 12;

function WorkflowProcessContent() {
  const router = useRouter();

  // Local state for filters
  const [queryParams, setQueryParams] = useState({
    q: "",
    sort: "stock_code_asc",
    view: "grid" as "grid" | "table",
    page: 0,
  });

  // Fetch data
  const { data: workflowProcesses, isLoading, error } = useWorkflowProcesses();

  // Event handlers
  const handleSearchChange = useCallback((value: string) => {
    setQueryParams((prev) => ({ ...prev, q: value, page: 0 }));
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setQueryParams((prev) => ({ ...prev, sort: value, page: 0 }));
  }, []);

  const handleViewChange = useCallback((value: "grid" | "table") => {
    setQueryParams((prev) => ({ ...prev, view: value }));
  }, []);

  const handlePageChange = useCallback((value: number) => {
    setQueryParams((prev) => ({ ...prev, page: value }));
  }, []);

  // Filter and sort workflow processes
  const filteredAndSortedProcesses = useMemo(() => {
    if (!workflowProcesses) return [];

    // First, filter the processes
    let filtered = workflowProcesses.filter((process) => {
      if (!queryParams.q) return true;

      const searchLower = queryParams.q.toLowerCase();
      return (
        process.stock_code.toLowerCase().includes(searchLower) ||
        process.product_details?.product_name
          ?.toLowerCase()
          .includes(searchLower) ||
        process.product_details?.product_code
          ?.toLowerCase()
          .includes(searchLower) ||
        process.process_details?.process_name
          ?.toLowerCase()
          .includes(searchLower) ||
        process.process_details?.process_code
          ?.toLowerCase()
          .includes(searchLower) ||
        false
      );
    });

    // Then, sort the filtered results
    return filtered.sort((a, b) => {
      switch (queryParams.sort) {
        case "stock_code_asc":
          return a.stock_code.localeCompare(b.stock_code);
        case "stock_code_desc":
          return b.stock_code.localeCompare(a.stock_code);
        case "sequence_asc":
          return a.sequence_order - b.sequence_order;
        case "sequence_desc":
          return b.sequence_order - a.sequence_order;
        case "product_asc":
          return (a.product_details?.product_name || "").localeCompare(
            b.product_details?.product_name || ""
          );
        case "product_desc":
          return (b.product_details?.product_name || "").localeCompare(
            a.product_details?.product_name || ""
          );
        default:
          return 0;
      }
    });
  }, [workflowProcesses, queryParams.q, queryParams.sort]);

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading workflow processes: {error.message}
      </div>
    );
  }

  return (
    <WorkflowProcessView
      items={filteredAndSortedProcesses}
      searchQuery={queryParams.q}
      onSearchChange={handleSearchChange}
      sortBy={queryParams.sort}
      onSortChange={handleSortChange}
      view={queryParams.view}
      onViewChange={handleViewChange}
      currentPage={queryParams.page}
      onPageChange={handlePageChange}
      pageSize={PAGE_SIZE}
      isLoading={isLoading}
    />
  );
}

export default function WorkflowCardsPage() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title="İş Akış Kartları"
        description="İş akış kartlarının takibi ve yönetimi"
        showBackButton
        onBack={handleBack}
        action={
          <Button asChild>
            <Link href="/workflow-cards/new" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Yeni İş Akış Kartı
            </Link>
          </Button>
        }
      />

      <Suspense fallback={<div>Loading workflow processes...</div>}>
        <WorkflowProcessContent />
      </Suspense>
    </div>
  );
}
