"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMachines } from "@/hooks/useMachines";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { MachineView } from "./components/machine-view";

const PAGE_SIZE = 50;

export default function FixedAssetsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get values from URL or use defaults
  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "name_asc";
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

  const { data: machines = [], isLoading, error } = useMachines();

  // Filter and sort machines
  const filteredAndSortedMachines = useMemo(() => {
    if (!machines) return [];

    // First, filter the machines
    let filtered = machines.filter((machine) => {
      const searchLower = query.toLowerCase();
      return (
        machine.machine_name.toLowerCase().includes(searchLower) ||
        machine.machine_code.toLowerCase().includes(searchLower) ||
        machine.description?.toLowerCase().includes(searchLower) ||
        false
      );
    });

    // Then, sort the filtered results
    return filtered.sort((a, b) => {
      switch (sort) {
        case "name_asc":
          return a.machine_name.localeCompare(b.machine_name);
        case "name_desc":
          return b.machine_name.localeCompare(a.machine_name);
        case "code_asc":
          return a.machine_code.localeCompare(b.machine_code);
        case "code_desc":
          return b.machine_code.localeCompare(a.machine_code);
        case "status_asc":
          return (a.status || "").localeCompare(b.status || "");
        case "status_desc":
          return (b.status || "").localeCompare(a.status || "");
        default:
          return 0;
      }
    });
  }, [machines, query, sort]);

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title="Demirbaş Tanıtım Kartları"
        description="Demirbaş tanıtım kartlarının takibi ve yönetimi"
        showBackButton
        action={
          <Link href="/fixed-assets/new">
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              Yeni Demirbaş Kartı
            </Button>
          </Link>
        }
      />

      <MachineView
        isLoading={isLoading}
        error={error}
        items={filteredAndSortedMachines}
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
