import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="flex flex-col md:flex-row gap-4 flex-1">
      <div className="flex-1">
        <Label htmlFor="search" className="sr-only">
          Ara
        </Label>
        <Input
          id="search"
          placeholder="İş akışı işlemlerini ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full md:w-[200px]">
        <Label htmlFor="sort" className="sr-only">
          Sırala
        </Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger id="sort">
            <SelectValue placeholder="Sıralama seçin" />
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
    </div>
  );
}
