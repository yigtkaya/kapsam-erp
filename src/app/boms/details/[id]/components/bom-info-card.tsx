"use client";

import { BOM } from "@/types/manufacture";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Product } from "@/types/inventory";

interface BOMInfoCardProps {
  bom: BOM;
  product: Product | undefined;
  products: Product[] | undefined;
  isEditing: boolean;
  isProductLoading: boolean;
  isCurrentProductLoading: boolean;
  selectedProduct: string;
  editedVersion: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedProduct: (product: string) => void;
  setEditedVersion: (version: string) => void;
}

export function BOMInfoCard({
  bom,
  product,
  products,
  isEditing,
  isProductLoading,
  isCurrentProductLoading,
  selectedProduct,
  editedVersion,
  open,
  setOpen,
  setSelectedProduct,
  setEditedVersion,
}: BOMInfoCardProps) {
  const productName = isCurrentProductLoading ? (
    <Skeleton className="h-4 w-[200px]" />
  ) : (
    product?.product_name || bom.product
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ürün ve Reçete Bilgileri</CardTitle>
        <CardDescription>
          Ürün ve reçete hakkında detaylı bilgiler
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium">Ürün</p>
            {isEditing ? (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between",
                      !selectedProduct && "text-muted-foreground"
                    )}
                    disabled={isProductLoading}
                  >
                    {selectedProduct
                      ? products?.find(
                          (product) => product.product_code === selectedProduct
                        )?.product_name || selectedProduct
                      : "Ürün seçin"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="Ürün ara..." />
                    <CommandEmpty>Ürün bulunamadı.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {products?.map((product) => (
                          <CommandItem
                            key={product.product_code}
                            value={product.product_code}
                            onSelect={(value) => {
                              setSelectedProduct(value);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedProduct === product.product_code
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {product.product_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="text-sm text-muted-foreground">{productName}</div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">Kategori</p>
            <p className="text-sm text-muted-foreground">
              {product?.inventory_category_display || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Durum</p>
            <Badge variant={bom.is_active ? "default" : "secondary"}>
              {bom.is_active ? "Aktif" : "Pasif"}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium">Versiyon</p>
            {isEditing ? (
              <Input
                value={editedVersion}
                onChange={(e) => setEditedVersion(e.target.value)}
                className="w-full"
                placeholder="Versiyon girin"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{bom.version}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">Oluşturulma Tarihi</p>
            <p className="text-sm text-muted-foreground">
              {new Date(bom.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Son Güncelleme</p>
            <p className="text-sm text-muted-foreground">
              {new Date(bom.modified_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
