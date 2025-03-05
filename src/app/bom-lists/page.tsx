"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useBOMs } from "@/hooks/useBOMs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { BOMView } from "@/app/bom-lists/components/bom-view";

const PAGE_SIZE = 50;

export default function BOMLists() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get values from URL or use defaults
  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "version_desc";
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

  const { data: boms = [], isLoading, error } = useBOMs();

  // Filter and sort BOMs
  const filteredAndSortedBOMs = useMemo(() => {
    if (!boms) return [];

    // First, filter the BOMs
    let filtered = boms.filter((bom) => {
      const searchLower = query.toLowerCase();
      return (
        bom.product?.product_name?.toLowerCase().includes(searchLower) ||
        bom.version.toLowerCase().includes(searchLower) ||
        bom.notes?.toLowerCase().includes(searchLower) ||
        false
      );
    });

    // Then, sort the filtered results
    return filtered.sort((a, b) => {
      switch (sort) {
        case "version_asc":
          return a.version.localeCompare(b.version);
        case "version_desc":
          return b.version.localeCompare(a.version);
        case "product_asc":
          return (a.product?.product_name || "").localeCompare(
            b.product?.product_name || ""
          );
        case "product_desc":
          return (b.product?.product_name || "").localeCompare(
            a.product?.product_name || ""
          );
        case "status_asc":
          return (a.is_active ? "1" : "0").localeCompare(
            b.is_active ? "1" : "0"
          );
        case "status_desc":
          return (b.is_active ? "1" : "0").localeCompare(
            a.is_active ? "1" : "0"
          );
        default:
          return 0;
      }
    });
  }, [boms, query, sort]);

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title="Ürün Ağaçları"
        description="Ürün ağaçlarının takibi ve yönetimi"
        showBackButton
        onBack={() => router.replace("/dashboard")}
        action={
          <Link href="/bom-lists/new">
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              Yeni Ürün Ağacı
            </Button>
          </Link>
        }
      />

      <BOMView
        isLoading={isLoading}
        error={error}
        items={filteredAndSortedBOMs}
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
