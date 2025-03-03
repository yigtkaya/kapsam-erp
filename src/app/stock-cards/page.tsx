"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard, ProductCardSkeleton } from "./components/product-card";
import { ProductFilters } from "./components/product-filters";
import { ProductTable } from "./components/product-table";
import { ViewToggle } from "./components/view-toggle";
import { PaginationControl } from "./components/pagination-control";
import { useState, useMemo } from "react";
import { Product } from "@/types/inventory";

// Product type order mapping for consistent sorting
const productTypeOrder = {
  SINGLE: 1,
  SEMI: 2,
  MONTAGED: 3,
  STANDARD_PART: 4,
};

const PAGE_SIZE = 50;

export default function StockCardsPage() {
  const { data: products, isLoading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(0);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    // First, filter the products
    let filtered = products.filter((product) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.product_name.toLowerCase().includes(searchLower) ||
        product.product_code.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        false
      );
    });

    // Then, sort the filtered results
    return filtered.sort((a, b) => {
      // Handle type-based sorting first
      if (sortBy.startsWith("type_")) {
        const typeMapping = {
          type_single: "SINGLE",
          type_semi: "SEMI",
          type_montaged: "MONTAGED",
          type_standard: "STANDARD_PART",
        };
        const targetType = typeMapping[sortBy as keyof typeof typeMapping];

        // If a's type matches the target type and b's doesn't, a should come first
        if (a.product_type === targetType && b.product_type !== targetType)
          return -1;
        if (b.product_type === targetType && a.product_type !== targetType)
          return 1;

        // If neither or both match the target type, sort by type order then name
        if (a.product_type !== targetType && b.product_type !== targetType) {
          const orderDiff =
            productTypeOrder[a.product_type as keyof typeof productTypeOrder] -
            productTypeOrder[b.product_type as keyof typeof productTypeOrder];
          return orderDiff !== 0
            ? orderDiff
            : a.product_name.localeCompare(b.product_name);
        }

        // If both match the target type, sort by name
        return a.product_name.localeCompare(b.product_name);
      }

      // Handle other sorting options
      switch (sortBy) {
        case "name_asc":
          return a.product_name.localeCompare(b.product_name);
        case "name_desc":
          return b.product_name.localeCompare(a.product_name);
        case "stock_asc":
          return a.current_stock - b.current_stock;
        case "stock_desc":
          return b.current_stock - a.current_stock;
        case "code_asc":
          return a.product_code.localeCompare(b.product_code);
        case "code_desc":
          return b.product_code.localeCompare(a.product_code);
        default:
          return 0;
      }
    });
  }, [products, searchQuery, sortBy]);

  // Reset page when filter/search changes
  useMemo(() => {
    setCurrentPage(0);
  }, [searchQuery, sortBy]);

  // Get current page items
  const currentItems = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    return filteredAndSortedProducts.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedProducts, currentPage]);

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title="Stok Tanıtım Kartları"
        description="Stok tanıtım kartlarının takibi ve yönetimi"
        showBackButton
        action={
          <Link href="/stock-cards/new">
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              Yeni Stok Tanıtım Kartı
            </Button>
          </Link>
        }
      />

      {!isLoading && !error && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      )}

      {error ? (
        <div className="text-center text-destructive">
          Ürünler yüklenirken bir hata oluştu.
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <ProductTable products={currentItems} />
          )}

          {!isLoading && filteredAndSortedProducts.length > 0 && (
            <PaginationControl
              currentPage={currentPage}
              totalItems={filteredAndSortedProducts.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}

      {!isLoading && !error && filteredAndSortedProducts.length === 0 && (
        <div className="text-center text-muted-foreground">
          {searchQuery
            ? "Aramanızla eşleşen ürün bulunamadı."
            : "Henüz ürün bulunmuyor."}
        </div>
      )}
    </div>
  );
}
