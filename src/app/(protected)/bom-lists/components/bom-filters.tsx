import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BOMFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function BOMFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: BOMFiltersProps) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Ürün ağacı ara..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sıralama" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="version_asc">Versiyon (A-Z)</SelectItem>
          <SelectItem value="version_desc">Versiyon (Z-A)</SelectItem>
          <SelectItem value="product_asc">Ürün Adı (A-Z)</SelectItem>
          <SelectItem value="product_desc">Ürün Adı (Z-A)</SelectItem>
          <SelectItem value="status_asc">Durum (Aktif-Pasif)</SelectItem>
          <SelectItem value="status_desc">Durum (Pasif-Aktif)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
