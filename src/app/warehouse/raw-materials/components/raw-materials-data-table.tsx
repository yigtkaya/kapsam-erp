import React from "react";
import DataTable, { Column } from "./data-table";
import { useRawMaterials } from "@/hooks/useRawMaterials";

export default function RawMaterialsDataTable() {
  const { data, isLoading, error } = useRawMaterials("HAMMADDE");

  const columns: Column[] = [
    { header: "Material Code", accessor: "material_code" },
    { header: "Material Name", accessor: "material_name" },
    { header: "Current Stock", accessor: "current_stock" },
  ];

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error loading raw materials data
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
