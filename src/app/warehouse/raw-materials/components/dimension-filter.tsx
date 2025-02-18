"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowDownIcon, ArrowUpIcon, FilterIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DimensionRange {
  min?: number;
  max?: number;
}

interface DimensionFilterProps<TData> {
  column: Column<TData, number>;
  label: string;
  minValue?: number;
  maxValue?: number;
}

export function DimensionFilter<TData>({
  column,
  label,
  minValue = 0,
  maxValue = 1000,
}: DimensionFilterProps<TData>) {
  const [open, setOpen] = useState(false);
  const [localValues, setLocalValues] = useState<DimensionRange>(() => {
    const filterValue = column.getFilterValue() as DimensionRange;
    return {
      min: filterValue?.min,
      max: filterValue?.max,
    };
  });

  const [errors, setErrors] = useState<{
    min?: string;
    max?: string;
  }>({});

  const debouncedValues = useDebounce(localValues, 300);

  useEffect(() => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (debouncedValues.min !== undefined) {
      if (debouncedValues.min < minValue) {
        newErrors.min = `Minimum değer ${minValue}'den küçük olamaz`;
        isValid = false;
      }
      if (
        debouncedValues.max !== undefined &&
        debouncedValues.min > debouncedValues.max
      ) {
        newErrors.min = "Minimum değer maximum değerden büyük olamaz";
        isValid = false;
      }
    }

    if (debouncedValues.max !== undefined) {
      if (debouncedValues.max > maxValue) {
        newErrors.max = `Maximum değer ${maxValue}'den büyük olamaz`;
        isValid = false;
      }
      if (
        debouncedValues.min !== undefined &&
        debouncedValues.max < debouncedValues.min
      ) {
        newErrors.max = "Maximum değer minimum değerden küçük olamaz";
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (isValid) {
      column.setFilterValue(
        debouncedValues.min === undefined && debouncedValues.max === undefined
          ? undefined
          : debouncedValues
      );
    }
  }, [debouncedValues, column, minValue, maxValue]);

  const handleInputChange = (type: "min" | "max", value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    setLocalValues((prev) => ({
      ...prev,
      [type]: numValue,
    }));
  };

  const handleSliderChange = (value: number[]) => {
    setLocalValues({
      min: value[0],
      max: value[1],
    });
  };

  const handleReset = () => {
    setLocalValues({ min: undefined, max: undefined });
    column.setFilterValue(undefined);
  };

  const handleSort = () => {
    column.toggleSorting(column.getIsSorted() === "asc");
  };

  const activeFilter = column.getFilterValue() as DimensionRange;
  const hasActiveFilter =
    (activeFilter?.min !== undefined && activeFilter?.min > minValue) ||
    (activeFilter?.max !== undefined && activeFilter?.max < maxValue);

  const handleApply = () => {
    setOpen(false);
    // Validation is already handled by useEffect with debouncedValues
  };

  return (
    <div className="flex gap-1 items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 bg-background hover:bg-muted",
              hasActiveFilter && "bg-primary/10"
            )}
          >
            <FilterIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{label} Filtresi</h4>
              <Separator />
              <div className="flex gap-2">
                <Input
                  placeholder={`Min ${label}`}
                  value={localValues.min ?? ""}
                  onChange={(e) => handleInputChange("min", e.target.value)}
                  className="h-8"
                />
                <Input
                  placeholder={`Max ${label}`}
                  value={localValues.max ?? ""}
                  onChange={(e) => handleInputChange("max", e.target.value)}
                  className="h-8"
                />
              </div>
              <Slider
                value={[
                  localValues.min || minValue,
                  localValues.max || maxValue,
                ]}
                min={minValue}
                max={maxValue}
                step={1}
                onValueChange={handleSliderChange}
              />
            </div>
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex-1"
                onClick={handleReset}
              >
                Temizle
              </Button>
              <Button size="sm" className="h-8 flex-1" onClick={handleApply}>
                Uygula
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
