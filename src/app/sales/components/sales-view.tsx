"use client";

import { SalesOrder } from "@/types/sales";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SalesFilters } from "./sales-filters";
import { useMemo } from "react";
import { useSalesOrders } from "../hooks/useSalesOrders";

interface SalesViewProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  currentPage: number;
  onPageChange: (value: number) => void;
  pageSize: number;
  isLoading: boolean;
}

// Move filtering and sorting logic inside the component
function processOrders(
  orders: SalesOrder[],
  query: string,
  sort: string,
  page: number,
  pageSize: number
) {
  if (!orders) return { currentItems: [], totalPages: 0 };

  // First, filter the orders
  let filtered = orders.filter((order) => {
    const searchLower = query.toLowerCase();
    return (
      order.order_number.toLowerCase().includes(searchLower) ||
      order.customer_name.toLowerCase().includes(searchLower) ||
      false
    );
  });

  // Then, sort the filtered results
  const sorted = filtered.sort((a, b) => {
    switch (sort) {
      case "order_number_asc":
        return a.order_number.localeCompare(b.order_number);
      case "order_number_desc":
        return b.order_number.localeCompare(a.order_number);
      case "customer_asc":
        return a.customer_name.localeCompare(b.customer_name);
      case "customer_desc":
        return b.customer_name.localeCompare(a.customer_name);
      case "date_asc":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "date_desc":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return 0;
    }
  });

  // Calculate pagination
  const start = page * pageSize;
  const end = start + pageSize;
  const currentItems = sorted.slice(start, end);
  const totalPages = Math.ceil(sorted.length / pageSize);

  return { currentItems, totalPages };
}

export function SalesView({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  currentPage,
  onPageChange,
  pageSize,
  isLoading,
}: SalesViewProps) {
  // Fetch data
  const { data: salesOrders = [] } = useSalesOrders();

  // Process orders with memoization
  const { currentItems, totalPages } = useMemo(
    () =>
      processOrders(salesOrders, searchQuery, sortBy, currentPage, pageSize),
    [salesOrders, searchQuery, sortBy, currentPage, pageSize]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Sipariş numarası veya müşteri ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Sıralama" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="order_number_asc">Sipariş No (A-Z)</SelectItem>
            <SelectItem value="order_number_desc">Sipariş No (Z-A)</SelectItem>
            <SelectItem value="customer_asc">Müşteri (A-Z)</SelectItem>
            <SelectItem value="customer_desc">Müşteri (Z-A)</SelectItem>
            <SelectItem value="date_asc">Tarih (Eski-Yeni)</SelectItem>
            <SelectItem value="date_desc">Tarih (Yeni-Eski)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SalesFilters />

      <DataTable
        data={currentItems.flatMap((item) => item.items)}
        columns={columns}
        isLoading={isLoading}
        currentPage={currentPage}
        pageCount={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
