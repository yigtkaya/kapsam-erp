"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, Suspense, useCallback, useTransition, useState } from "react";
import { WorkflowProcessView } from "./components/workflow-process-view";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useWorkflowProcesses } from "./hooks/use-workflow-hooks";
import { useEffect } from "react";

const PAGE_SIZE = 12;

function WorkflowProcessContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Initialize your parameters from the URL or defaults.
  const [queryParams, setQueryParams] = useState({
    q: searchParams.get("q") || "",
    sort: searchParams.get("sort") || "stock_code_asc",
    view: (searchParams.get("view") || "grid") as "grid" | "table",
    page: searchParams.get("page") || "0",
  });

  // When queryParams change, update the URL.
  useEffect(() => {
    // Construct the desired search string from queryParams.
    const newSearch = new URLSearchParams(queryParams).toString();
    // Get the current search string from the URL.
    const currentSearch = searchParams.toString();

    // Only push if the search strings differ.
    if (newSearch !== currentSearch) {
      const timer = setTimeout(() => {
        startTransition(() => {
          router.push(`${pathname}?${newSearch}`);
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [queryParams, pathname, router, searchParams, startTransition]);

  // Now, your event handlers only update local state.
  const handleSearchChange = useCallback((value: string) => {
    setQueryParams((prev) => ({ ...prev, q: value, page: "0" }));
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setQueryParams((prev) => ({ ...prev, sort: value, page: "0" }));
  }, []);

  const handleViewChange = useCallback((value: "grid" | "table") => {
    setQueryParams((prev) => ({ ...prev, view: value }));
  }, []);

  const handlePageChange = useCallback((value: number) => {
    setQueryParams((prev) => ({ ...prev, page: value.toString() }));
  }, []);

  // Fetch data with useSuspenseQuery
  const { data: workflowProcesses = [] } = useWorkflowProcesses();

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

  return (
    <WorkflowProcessView
      items={filteredAndSortedProcesses}
      searchQuery={queryParams.q}
      onSearchChange={handleSearchChange}
      sortBy={queryParams.sort}
      onSortChange={handleSortChange}
      view={queryParams.view}
      onViewChange={handleViewChange}
      currentPage={Number(queryParams.page)}
      onPageChange={handlePageChange}
      pageSize={PAGE_SIZE}
      isLoading={isPending}
    />
  );
}

export default function WorkflowCardsPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleBack = useCallback(() => {
    startTransition(() => {
      router.replace("/dashboard");
    });
  }, [router, startTransition]);

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
