"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { List } from "lucide-react";
interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <List className="mr-2 h-4 w-4" />
          Görünüm
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Sütunları Göster/Gizle</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id === "order_number"
                  ? "Sipariş No"
                  : column.id === "stock_code"
                  ? "Stok Kodu"
                  : column.id === "product_name"
                  ? "Ürün Adı"
                  : column.id === "nonconformity_detection_process"
                  ? "Tespit Süreci"
                  : column.id === "nonconformity_description"
                  ? "Uygunsuzluk Açıklaması"
                  : column.id === "corrective_action"
                  ? "Düzeltici Faaliyet"
                  : column.id === "quantity"
                  ? "Miktar"
                  : column.id === "intact"
                  ? "Sağlam"
                  : column.id === "rework"
                  ? "Tamir"
                  : column.id === "scrap"
                  ? "Hurda"
                  : column.id === "date"
                  ? "Tarih"
                  : column.id === "exit_date"
                  ? "Çıkış Tarihi"
                  : column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
