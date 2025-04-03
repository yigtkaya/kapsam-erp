"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Suspense,
  useCallback,
  useTransition,
  useState,
  useEffect,
} from "react";
import { SalesView } from "./components/sales-view";

const PAGE_SIZE = 50;

export default function SalesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state to prevent UI jitter
  const [localQuery, setLocalQuery] = useState(searchParams.get("q") || "");
  const [localSortBy, setLocalSortBy] = useState(
    searchParams.get("sort") || "order_number_asc"
  );
  const [localPage, setLocalPage] = useState(
    parseInt(searchParams.get("page") || "0")
  );

  // Get values from URL or use defaults
  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "order_number_asc";
  const page = parseInt(searchParams.get("page") || "0");

  // Sync URL params to local state on initial load and URL changes
  useEffect(() => {
    setLocalQuery(query);
    setLocalSortBy(sort);
    setLocalPage(page);
  }, [query, sort, page]);

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
      // Update local state immediately
      setLocalQuery(value);
      setLocalPage(0);

      // Debounce URL update for smoother UI
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
      // Update local state immediately
      setLocalSortBy(value);

      // Update URL
      startTransition(() => {
        router.push(
          `${pathname}?${createQueryString({
            sort: value,
          })}`
        );
      });
    },
    [router, pathname, createQueryString]
  );

  const handlePageChange = useCallback(
    (value: number) => {
      // Update local state immediately
      setLocalPage(value);

      // Update URL
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
              <Button variant="primary-blue" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Yeni Sipariş
              </Button>
            </Link>
          }
        />

        <Suspense fallback={<div>Loading sales data...</div>}>
          <SalesView
            isLoading={isPending}
            searchQuery={localQuery}
            onSearchChange={handleSearchChange}
            sortBy={localSortBy}
            onSortChange={handleSortChange}
            currentPage={localPage}
            onPageChange={handlePageChange}
            pageSize={PAGE_SIZE}
          />
        </Suspense>
      </div>
    </div>
  );
}
