"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useWorkflowProcesses } from "@/hooks/useManufacturing";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";
import { WorkflowProcessView } from "./components/workflow-process-view";

const PAGE_SIZE = 12;

export default function WorkflowCardsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get values from URL or use defaults
  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "stock_code_asc";
  const viewMode = (searchParams.get("view") || "grid") as "grid" | "table";
  const page = parseInt(searchParams.get("page") || "0");

  // Create URL update function
  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Update URL handlers
  const handleSearchChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString({
        q: value,
        page: "0", // Reset page when search changes
      })}`
    );
  };

  const handleSortChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString({
        sort: value,
        page: "0", // Reset page when sort changes
      })}`
    );
  };

  const handleViewChange = (value: "grid" | "table") => {
    router.push(
      `${pathname}?${createQueryString({
        view: value,
      })}`
    );
  };

  const handlePageChange = (value: number) => {
    router.push(
      `${pathname}?${createQueryString({
        page: value.toString(),
      })}`
    );
  };

  const {
    data: workflowProcesses = [],
    isLoading,
    error,
  } = useWorkflowProcesses();

  // Filter and sort workflow processes
  const filteredAndSortedProcesses = useMemo(() => {
    if (!workflowProcesses) return [];

    // First, filter the processes
    let filtered = workflowProcesses.filter((process) => {
      const searchLower = query.toLowerCase();
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
      switch (sort) {
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
  }, [workflowProcesses, query, sort]);

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title="İş akışı işlemleri"
        description="Ürünler için iş akışı işlemlerini yönetin"
        showBackButton
        onBack={() => router.replace("/dashboard")}
        action={
          <Button asChild>
            <Link href="/workflow-cards/new">
              <Plus className="mr-2 h-4 w-4" />
              İş akışı işlemi ekle
            </Link>
          </Button>
        }
      />

      <WorkflowProcessView
        isLoading={isLoading}
        error={error}
        items={filteredAndSortedProcesses}
        searchQuery={query}
        onSearchChange={handleSearchChange}
        sortBy={sort}
        onSortChange={handleSortChange}
        view={viewMode}
        onViewChange={handleViewChange}
        currentPage={page}
        onPageChange={handlePageChange}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
