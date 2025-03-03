"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { Package, Tag, BarChart4 } from "lucide-react";
import Link from "next/link";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ürün Adı</TableHead>
            <TableHead>Ürün Kodu</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Tür</TableHead>
            <TableHead>Kategori</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className="group cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="font-medium">
                <Link
                  href={`/stock-cards/${product.id}`}
                  className="block w-full group-hover:underline"
                >
                  {product.product_name}
                </Link>
              </TableCell>
              <TableCell>{product.product_code}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 w-fit"
                >
                  <Package className="h-3 w-3" />
                  {product.current_stock}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 w-fit"
                >
                  <Tag className="h-3 w-3" />
                  {product.product_type}
                </Badge>
              </TableCell>
              <TableCell>
                {product.inventory_category_display && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 w-fit"
                  >
                    <BarChart4 className="h-3 w-3" />
                    {product.inventory_category_display}
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
