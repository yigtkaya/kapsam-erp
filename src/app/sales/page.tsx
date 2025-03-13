"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense, useCallback, useTransition } from "react";
import { SalesView } from "./components/sales-view";

const PAGE_SIZE = 50;

export default function SalesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

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

        <Suspense fallback={<div>Loading sales data...</div>}>
          <SalesView
            isLoading={isPending}
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
