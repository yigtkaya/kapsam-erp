"use client";

import { useSalesOrders } from "./hooks/useSalesOrders";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./components/columns";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";

export default function SalesOrdersPage() {
  const router = useRouter();
  const { data: salesOrders, isLoading } = useSalesOrders();

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="Siparişler   "
        description="Siparişleri yönetin"
        action={
          <Button onClick={() => router.push("/sales/new")}>
            <Plus className="mr-2 h-4 w-4" /> Yeni Sipariş
          </Button>
        }
      />
      <div className="mt-6">
        <DataTable
          columns={columns}
          data={salesOrders || []}
          isLoading={isLoading}
          searchKey="order_number"
        />
      </div>
    </div>
  );
}
