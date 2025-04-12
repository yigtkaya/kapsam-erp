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
import { useMemo, useState, useEffect, useRef } from "react";
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
  page: number,
  pageSize: number,
  statusFilter: string = "all"
) {
  if (!orders) return { currentItems: [], totalPages: 0 };

  // First, filter the orders
  let filtered = orders.filter((order) => {
    const searchLower = query.toLowerCase();
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchLower) ||
      order.customer_name.toLowerCase().includes(searchLower);

    // Apply status filter if not set to "all"
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "OPEN" && order.status === "OPEN") ||
      (statusFilter === "CLOSED" && order.status === "CLOSED") ||
      (statusFilter === "pending" && order.status === "OPEN") ||
      (statusFilter === "completed" && order.status === "CLOSED");

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const start = page * pageSize;
  const end = start + pageSize;
  const currentItems = filtered.slice(start, end);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return { currentItems, totalPages, allItems: filtered };
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
  // Add state for status filter
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const isInitialRender = useRef(true);

  // Process orders with memoization - but don't apply sorting here anymore
  const { currentItems, totalPages, allItems } = useMemo(
    () =>
      processOrders(
        salesOrders,
        searchQuery,
        currentPage,
        pageSize,
        statusFilter
      ),
    [salesOrders, searchQuery, currentPage, pageSize, statusFilter]
  );

  // Debounced URL update for sorting
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const updateTimeout = setTimeout(() => {
      // This will only update the URL, not trigger a data fetch
      if (sortBy) {
        onSortChange(sortBy);
      }
    }, 300); // Wait for 300ms of inactivity before updating URL

    return () => clearTimeout(updateTimeout);
  }, [sortBy, onSortChange]);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    // Reset to page 0 when filter changes
    onPageChange(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Sipariş numarası veya müşteri ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Bütün Durumlar</SelectItem>
            <SelectItem value="OPEN">Bekliyor</SelectItem>
            <SelectItem value="CLOSED">Tamamlandı</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Tarih Aralığı" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Zamanlar</SelectItem>
            <SelectItem value="today">Bugün</SelectItem>
            <SelectItem value="last_7_days">Son 7 Gün</SelectItem>
            <SelectItem value="last_30_days">Son 30 Gün</SelectItem>
            <SelectItem value="this_month">Bu Ay</SelectItem>
            <SelectItem value="last_month">Geçen Ay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={currentItems.flatMap((item) => item.items)}
        columns={columns}
        isLoading={isLoading}
        currentPage={currentPage}
        pageCount={totalPages}
        onPageChange={onPageChange}
        onSortChange={onSortChange}
      />
    </div>
  );
}
