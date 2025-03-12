import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface WorkflowProcessFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function WorkflowProcessFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: WorkflowProcessFiltersProps) {
  return (
    <div className="flex items-center gap-2 max-w-[600px]">
      <div className="relative w-[280px]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="İş akışı ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-9"
        />
      </div>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder="Sıralama" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="stock_code_asc">Stok Kodu (A-Z)</SelectItem>
          <SelectItem value="stock_code_desc">Stok Kodu (Z-A)</SelectItem>
          <SelectItem value="sequence_asc">Sıra (Artan)</SelectItem>
          <SelectItem value="sequence_desc">Sıra (Azalan)</SelectItem>
          <SelectItem value="product_asc">Ürün Adı (A-Z)</SelectItem>
          <SelectItem value="product_desc">Ürün Adı (Z-A)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
