"use client";

import React from "react";
import { useRawMaterials } from "@/hooks/useRawMaterials";
import { RawMaterial } from "@/types/inventory";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RawMaterialsDataTable() {
  const { data, isLoading, error } = useRawMaterials({
    category: "HAMMADDE",
    page: 1,
    page_size: 50,
  });

  if (isLoading) {
    return <div>Loading raw materials...</div>;
  }

  if (error) {
    return <div>Error loading raw materials: {error.message}</div>;
  }

  // Check if there are no raw materials returned
  if (data?.results && data.results.length === 0) {
    return <div>No raw materials found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Material Code</TableCell>
          <TableCell>Material Name</TableCell>
          <TableCell>Current Stock</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.results.map((material: RawMaterial) => (
          <TableRow key={material.id}>
            <TableCell>{material.id}</TableCell>
            <TableCell>{material.material_code}</TableCell>
            <TableCell>{material.material_name}</TableCell>
            <TableCell>{material.current_stock}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
