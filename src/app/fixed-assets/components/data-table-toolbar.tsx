"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MachineStatus, MachineType } from "@/types/manufacture";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";
import { Cross } from "lucide-react";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Demirbaş kodu ile ara..."
          value={
            (table.getColumn("machine_code")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("machine_code")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("machine_type") && (
          <DataTableFacetedFilter
            column={table.getColumn("machine_type")}
            title="Makine Tipi"
            options={Object.values(MachineType).map((type) => ({
              label: type,
              value: type,
            }))}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Durum"
            options={Object.values(MachineStatus).map((status) => ({
              label:
                status === "AVAILABLE"
                  ? "Müsait"
                  : status === "IN_USE"
                  ? "Kullanımda"
                  : "Bakımda",
              value: status,
            }))}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Filtreleri Temizle
            <Cross className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
