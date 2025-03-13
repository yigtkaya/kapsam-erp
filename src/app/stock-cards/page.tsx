"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useRawMaterials } from "@/hooks/useRawMaterials";
import { useState, useMemo, useCallback, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductView } from "./components/product-view";
import { RawMaterialView } from "./components/raw-material-view";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CreateStockCardDialog } from "./components/create-stock-card-dialog";

// Product type order mapping for consistent sorting
const productTypeOrder = {
  SINGLE: 1,
  SEMI: 2,
  MONTAGED: 3,
  STANDARD_PART: 4,
};

const PAGE_SIZE = 50;

function ProductsTab({
  query,
  sort,
  viewMode,
  page,
  handleSearchChange,
  handleSortChange,
  handleViewChange,
  handlePageChange,
}: {
  query: string;
  sort: string;
  viewMode: "grid" | "table";
  page: number;
  handleSearchChange: (value: string) => void;
  handleSortChange: (value: string) => void;
  handleViewChange: (value: "grid" | "table") => void;
  handlePageChange: (value: number) => void;
}) {
  const { data: products } = useProducts();

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    // First, filter the products
    let filtered = products.filter((product) => {
      const searchLower = query.toLowerCase();
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
      if (sort.startsWith("type_")) {
        const typeMapping = {
          type_single: "SINGLE",
          type_semi: "SEMI",
          type_montaged: "MONTAGED",
          type_standard: "STANDARD_PART",
        };
        const targetType = typeMapping[sort as keyof typeof typeMapping];

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
      switch (sort) {
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
  }, [products, query, sort]);

  return (
    <ProductView
      isLoading={false}
      error={null}
      items={filteredAndSortedProducts}
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
  );
}

function RawMaterialsTab({
  query,
  sort,
  viewMode,
  page,
  handleSearchChange,
  handleSortChange,
  handleViewChange,
  handlePageChange,
}: {
  query: string;
  sort: string;
  viewMode: "grid" | "table";
  page: number;
  handleSearchChange: (value: string) => void;
  handleSortChange: (value: string) => void;
  handleViewChange: (value: "grid" | "table") => void;
  handlePageChange: (value: number) => void;
}) {
  const { data: rawMaterials } = useRawMaterials({});

  // Filter and sort raw materials
  const filteredAndSortedRawMaterials = useMemo(() => {
    if (!rawMaterials) return [];

    // First, filter the raw materials
    let filtered = rawMaterials.filter((material) => {
      const searchLower = query.toLowerCase();
      return (
        material.material_name.toLowerCase().includes(searchLower) ||
        material.material_code.toLowerCase().includes(searchLower)
      );
    });

    // Then, sort the filtered results
    return filtered.sort((a, b) => {
      switch (sort) {
        case "name_asc":
          return a.material_name.localeCompare(b.material_name);
        case "name_desc":
          return b.material_name.localeCompare(a.material_name);
        case "stock_asc":
          return a.current_stock - b.current_stock;
        case "stock_desc":
          return b.current_stock - a.current_stock;
        case "code_asc":
          return a.material_code.localeCompare(b.material_code);
        case "code_desc":
          return b.material_code.localeCompare(a.material_code);
        default:
          return 0;
      }
    });
  }, [rawMaterials, query, sort]);

  return (
    <RawMaterialView
      items={filteredAndSortedRawMaterials}
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
  );
}

export default function StockCardsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get values from URL or use defaults
  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "name_asc";
  const viewMode = (searchParams.get("view") || "grid") as "grid" | "table";
  const page = parseInt(searchParams.get("page") || "0");
  const tab = (searchParams.get("tab") || "products") as
    | "products"
    | "raw-materials";

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

  const handleTabChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString({
        tab: value,
        page: "0", // Reset page when tab changes
      })}`
    );
  };

  return (
    <div className="container mx-auto py-4 space-y-6">
      <PageHeader
        title="Stok Tanıtım Kartları"
        description="Stok tanıtım kartlarının takibi ve yönetimi"
        showBackButton
        onBack={() => router.replace("/dashboard")}
        action={<CreateStockCardDialog />}
      />

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Ürünler</TabsTrigger>
          <TabsTrigger value="raw-materials">Hammaddeler</TabsTrigger>
          <TabsTrigger value="tools">Takımlar</TabsTrigger>
          <TabsTrigger value="holders">Tutucular</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsTab
              query={query}
              sort={sort}
              viewMode={viewMode}
              page={page}
              handleSearchChange={handleSearchChange}
              handleSortChange={handleSortChange}
              handleViewChange={handleViewChange}
              handlePageChange={handlePageChange}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="raw-materials" className="space-y-6">
          <Suspense fallback={<div>Loading raw materials...</div>}>
            <RawMaterialsTab
              query={query}
              sort={sort}
              viewMode={viewMode}
              page={page}
              handleSearchChange={handleSearchChange}
              handleSortChange={handleSortChange}
              handleViewChange={handleViewChange}
              handlePageChange={handlePageChange}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="tools">
          <div className="text-center py-8 text-muted-foreground">
            Coming soon...
          </div>
        </TabsContent>

        <TabsContent value="holders">
          <div className="text-center py-8 text-muted-foreground">
            Coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
