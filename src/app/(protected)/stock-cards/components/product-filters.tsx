"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Ürün ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Sıralama" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Ürün Tipi</SelectLabel>
            <SelectItem value="type_single">Tekli Parçalar</SelectItem>
            <SelectItem value="type_semi">Proses Parçaları</SelectItem>
            <SelectItem value="type_montaged">Montajlı Parçalar</SelectItem>
            <SelectItem value="type_standard">Standart Parçalar</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>İsim & Kod</SelectLabel>
            <SelectItem value="name_asc">İsim (A-Z)</SelectItem>
            <SelectItem value="name_desc">İsim (Z-A)</SelectItem>
            <SelectItem value="code_asc">Ürün Kodu (A-Z)</SelectItem>
            <SelectItem value="code_desc">Ürün Kodu (Z-A)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Stok</SelectLabel>
            <SelectItem value="stock_desc">Stok (Çok - Az)</SelectItem>
            <SelectItem value="stock_asc">Stok (Az - Çok)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
