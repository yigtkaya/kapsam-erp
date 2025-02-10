import React from "react";
import DataTable, { Column } from "./data-table";
import { useProducts } from "@/hooks/useProducts";

export default function StandardPartsDataTable() {
  const { data, isLoading, error } = useProducts("HAMMADDE", "STANDARD_PART");

  const columns: Column[] = [
    { header: "Product Code", accessor: "product_code" },
    { header: "Product Name", accessor: "product_name" },
    { header: "Product Type", accessor: "product_type" },
    { header: "Current Stock", accessor: "current_stock" },
  ];

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error loading standard parts data
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data?.items || []}
      page={0}
      pageSize={0}
      totalPages={0}
      onPageChange={function (page: number): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}
