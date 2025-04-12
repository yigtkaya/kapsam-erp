"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense, useCallback, useTransition, useState, useRef } from "react";
import { SalesView } from "./components/sales-view";

const PAGE_SIZE = 50;

export default function SalesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const isInitialMount = useRef(true);

  // Local state initialized from URL params only on initial load
  const [localQuery, setLocalQuery] = useState(searchParams.get("q") || "");
  const [localSortBy, setLocalSortBy] = useState(
    searchParams.get("sort") || "order_number_asc"
  );
  const [localPage, setLocalPage] = useState(
    parseInt(searchParams.get("page") || "0")
  );

  // Update handlers keep state only locally, without URL updates
  const handleSearchChange = useCallback((value: string) => {
    setLocalQuery(value);
    setLocalPage(0);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setLocalSortBy(value);
  }, []);

  const handlePageChange = useCallback((value: number) => {
    setLocalPage(value);
  }, []);

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

        {/* Example of how to use the useCreateOrderShipment hook 
        
        Usage:

        import { useCreateOrderShipment } from './hooks/useShipments';
        
        // Inside a component where orderId is available
        const { mutate: createShipment, isLoading } = useCreateOrderShipment("ORDER-123");
        
        // Later, when you need to create a shipment:
        const handleCreateShipment = () => {
          createShipment({
            shipping_no: "SHIP-001",
            shipping_date: "2023-03-15",
            order_item: 123,
            quantity: 10,
            package_number: 1,
            shipping_note: "Handle with care"
          });
        };
        
        // In your JSX:
        <Button 
          onClick={handleCreateShipment} 
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Shipment"}
        </Button>
        */}
      </div>
    </div>
  );
}
