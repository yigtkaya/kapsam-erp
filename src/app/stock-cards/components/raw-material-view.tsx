import { RawMaterial, Product } from "@/types/inventory";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { ProductFilters } from "./product-filters";
import { ProductTable } from "./product-table";
import { ViewToggle } from "./view-toggle";
import { PaginationControl } from "./pagination-control";
import { RawMaterialCard } from "./raw-material-card";

interface RawMaterialViewProps {
  items: RawMaterial[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  view: "grid" | "table";
  onViewChange: (value: "grid" | "table") => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}

export function RawMaterialView({
  items,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  view,
  onViewChange,
  currentPage,
  onPageChange,
  pageSize,
}: RawMaterialViewProps) {
  // Convert RawMaterial to Product type for display
  const convertToProduct = (material: RawMaterial): Product => ({
    id: material.id,
    product_name: material.material_name,
    product_code: material.material_code,
    current_stock: material.current_stock,
    description: `${material.material_type} - ${
      material.width ? `W:${material.width}mm ` : ""
    }${material.height ? `H:${material.height}mm ` : ""}${
      material.thickness ? `T:${material.thickness}mm ` : ""
    }${material.diameter_mm ? `D:${material.diameter_mm}mm` : ""}`,
    product_type: "STANDARD_PART",
    created_at: new Date().toISOString(),
    modified_at: new Date().toISOString(),
    inventory_category: material.inventory_category?.id,
    inventory_category_display: material.inventory_category?.name,
  });

  const start = currentPage * pageSize;
  const currentItems = items.slice(start, start + pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>

      <div className="space-y-4">
        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentItems.map((material) => (
              <RawMaterialCard key={material.id} material={material} />
            ))}
          </div>
        ) : (
          <ProductTable
            products={currentItems.map((material) =>
              convertToProduct(material)
            )}
          />
        )}

        {items.length > 0 && (
          <PaginationControl
            currentPage={currentPage}
            totalItems={items.length}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        )}
      </div>

      {items.length === 0 && (
        <div className="text-center text-muted-foreground">
          {searchQuery
            ? "Aramanızla eşleşen hammadde bulunamadı."
            : "Henüz hammadde bulunmuyor."}
        </div>
      )}
    </div>
  );
}
