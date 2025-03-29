"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

interface SalesFiltersProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export function SalesFilters({
  statusFilter,
  onStatusChange,
}: SalesFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="h-8 w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Bütün Durumlar</SelectItem>
          <SelectItem value="OPEN">Bekliyor</SelectItem>
          <SelectItem value="CLOSED">Tamamlandı</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all">
        <SelectTrigger className="h-8 w-[150px]">
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
      <div className="flex-1" />
    </div>
  );
}
