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
import {
  startOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";

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
  statusFilter: string = "all",
  dateFilter: string = "all"
) {
  if (!orders) return { currentItems: [], totalPages: 0, allItems: [] };

  // Calculate date ranges for filtering
  const today = startOfDay(new Date());
  const last7Days = subDays(today, 7);
  const last30Days = subDays(today, 30);
  const thisMonthStart = startOfMonth(today);
  const lastMonthStart = startOfMonth(subDays(thisMonthStart, 1));
  const lastMonthEnd = endOfMonth(lastMonthStart);

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

    // Apply date filter
    let matchesDate = true;
    if (dateFilter !== "all" && order.created_at) {
      const orderDate = new Date(order.created_at);

      switch (dateFilter) {
        case "today":
          matchesDate = orderDate >= today;
          break;
        case "last_7_days":
          matchesDate = orderDate >= last7Days;
          break;
        case "last_30_days":
          matchesDate = orderDate >= last30Days;
          break;
        case "this_month":
          matchesDate = orderDate >= thisMonthStart;
          break;
        case "last_month":
          matchesDate = isWithinInterval(orderDate, {
            start: lastMonthStart,
            end: lastMonthEnd,
          });
          break;
        default:
          matchesDate = true;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
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
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Process orders with memoization
  const { currentItems, totalPages, allItems } = useMemo(
    () =>
      processOrders(
        salesOrders,
        searchQuery,
        currentPage,
        pageSize,
        statusFilter,
        dateFilter
      ),
    [salesOrders, searchQuery, currentPage, pageSize, statusFilter, dateFilter]
  );

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetToFirstPage();
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    resetToFirstPage();
  };

  // Reset to page 0 when filters change
  const resetToFirstPage = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onPageChange(0);
    }, 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Sipariş numarası veya müşteri ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm h-10 border border-input rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="max-w-[200px] h-10 border border-input rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Bütün Durumlar</SelectItem>
            <SelectItem value="OPEN">Bekliyor</SelectItem>
            <SelectItem value="CLOSED">Tamamlandı</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={handleDateFilterChange}>
          <SelectTrigger className="max-w-[200px] h-10 border border-input rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
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
