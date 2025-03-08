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

interface SalesViewProps {
  isLoading: boolean;
  error: Error | null;
  items: SalesOrder[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  currentPage: number;
  onPageChange: (value: number) => void;
  pageSize: number;
}

export function SalesView({
  isLoading,
  error,
  items,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  currentPage,
  onPageChange,
  pageSize,
}: SalesViewProps) {
  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4">
        <p className="text-sm text-destructive">
          Failed to load sales orders. Please try again later.
        </p>
      </div>
    );
  }

  const start = currentPage * pageSize;
  const end = start + pageSize;
  const currentItems = items.slice(start, end);
  const totalPages = Math.ceil(items.length / pageSize);
  const items2 = currentItems.flatMap((item) => item.items);
  console.log(items2);

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
