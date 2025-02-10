"use client";

import React from "react";
import { useProducts } from "@/hooks/useProducts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types/inventory";

// This component demonstrates how to fetch products (here, considered as "standard parts")
export default function StandardPartsDataTable() {
  // Replace these parameters with the actual category and product type for standard parts.
  const { data, isLoading, error } = useProducts({
    category: "HAMMADDE",
    product_type: "STANDARD_PART",
    page: 1,
    page_size: 50,
  });

  if (isLoading) {
    return <div>Loading standard parts...</div>;
  }

  if (error) {
    return <div>Error loading standard parts: {error.message}</div>;
  }

  // Check if there are no standard parts returned
  if (data?.results && data.results.length === 0) {
    return <div>No standard parts found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Product Code</TableCell>
          <TableCell>Product Name</TableCell>
          <TableCell>Current Stock</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.results.map((product: Product) => (
          <TableRow key={product.id}>
            <TableCell>{product.id}</TableCell>
            <TableCell>{product.product_code}</TableCell>
            <TableCell>{product.product_name}</TableCell>
            <TableCell>{product.current_stock}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
