"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense, useCallback, useMemo, useTransition } from "react";
import { useSalesOrders } from "./hooks/useSalesOrders";
import { SalesView } from "./components/sales-view";
import { SalesOrder } from "@/types/sales";

const PAGE_SIZE = 50;

// Move filtering and sorting logic outside component
function filterAndSortOrders(
  orders: SalesOrder[],
  query: string,
  sort: string
): SalesOrder[] {
  if (!orders) return [];

  // First, filter the orders
  let filtered = orders.filter((order) => {
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
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "date_desc":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return 0;
    }
  });
}

export default function SalesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { data: salesOrders = [], isLoading } = useSalesOrders();

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

  // Update URL handlers with transitions
  const handleSearchChange = useCallback(
    (value: string) => {
      startTransition(() => {
        router.push(
          `${pathname}?${createQueryString({
            q: value,
            page: "0", // Reset page when search changes
          })}`
        );
      });
    },
    [router, pathname, createQueryString]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      startTransition(() => {
        router.push(
          `${pathname}?${createQueryString({
            sort: value,
            page: "0", // Reset page when sort changes
          })}`
        );
      });
    },
    [router, pathname, createQueryString]
  );

  const handlePageChange = useCallback(
    (value: number) => {
      startTransition(() => {
        router.push(
          `${pathname}?${createQueryString({
            page: value.toString(),
          })}`
        );
      });
    },
    [router, pathname, createQueryString]
  );

  // Filter and sort sales orders
  const filteredAndSortedOrders = useMemo(
    () => filterAndSortOrders(salesOrders, query, sort),
    [salesOrders, query, sort]
  );

  return (
    <div className="overflow-x-hidden">
      <div className="mx-auto py-4 space-y-6 px-4">
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

        <Suspense>
          <SalesView
            isLoading={isLoading || isPending}
            error={null}
            items={filteredAndSortedOrders}
            searchQuery={query}
            onSearchChange={handleSearchChange}
            sortBy={sort}
            onSortChange={handleSortChange}
            currentPage={page}
            onPageChange={handlePageChange}
            pageSize={PAGE_SIZE}
          />
        </Suspense>
      </div>
    </div>
  );
}
