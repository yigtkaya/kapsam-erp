"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useSalesOrders } from "./hooks/useSalesOrders";
import { SalesView } from "./components/sales-view";

const PAGE_SIZE = 50;

export default function SalesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: salesOrders = [], isLoading, error } = useSalesOrders();

  // Get values from URL or use defaults
  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "order_number_asc";
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

  const handlePageChange = (value: number) => {
    router.push(
      `${pathname}?${createQueryString({
        page: value.toString(),
      })}`
    );
  };

  // Filter and sort sales orders
  const filteredAndSortedOrders = useMemo(() => {
    if (!salesOrders) return [];

    // First, filter the orders
    let filtered = salesOrders.filter((order) => {
      const searchLower = query.toLowerCase();
      return (
        order.order_number.toLowerCase().includes(searchLower) ||
        order.customer_name.toLowerCase().includes(searchLower) ||
        false
      );
    });

    // Then, sort the filtered results
    return filtered.sort((a, b) => {
      switch (sort) {
        case "order_number_asc":
          return a.order_number.localeCompare(b.order_number);
        case "order_number_desc":
          return b.order_number.localeCompare(a.order_number);
        case "customer_asc":
          return a.customer_name.localeCompare(b.customer_name);
        case "customer_desc":
          return b.customer_name.localeCompare(a.customer_name);
        case "date_asc":
          return (
            new Date(a.order_date).getTime() - new Date(b.order_date).getTime()
          );
        case "date_desc":
          return (
            new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
          );
        default:
          return 0;
      }
    });
  }, [salesOrders, query, sort]);

  return (
    <div className="max-w-[1600px] mx-auto py-4 space-y-6 px-4">
      <PageHeader
        title="Siparişler"
        description="Siparişlerin takibi ve yönetimi"
        showBackButton
        onBack={() => router.replace("/dashboard")}
        action={
          <Link href="/sales/new">
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              Yeni Sipariş
            </Button>
          </Link>
        }
      />

      <SalesView
        isLoading={isLoading}
        error={error}
        items={filteredAndSortedOrders}
        searchQuery={query}
        onSearchChange={handleSearchChange}
        sortBy={sort}
        onSortChange={handleSortChange}
        currentPage={page}
        onPageChange={handlePageChange}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
