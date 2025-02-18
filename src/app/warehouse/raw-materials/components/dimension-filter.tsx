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
  maxValue = 99999,
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
    activeFilter?.min !== undefined || activeFilter?.max !== undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={handleSort}
          >
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="h-4 w-4" />
            ) : (
              <ArrowUpIcon className="h-4 w-4 opacity-50" />
            )}
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={hasActiveFilter ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  hasActiveFilter && "border-solid bg-muted"
                )}
              >
                <FilterIcon className="h-4 w-4" />
                <span className="sr-only">Filter by {label}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{label} Filtresi</h4>
                  {hasActiveFilter && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 lg:px-3"
                      onClick={handleReset}
                    >
                      Sıfırla
                      <X className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="pt-4">
                  <Slider
                    min={minValue}
                    max={maxValue}
                    step={1}
                    value={[
                      localValues.min ?? minValue,
                      localValues.max ?? maxValue,
                    ]}
                    onValueChange={handleSliderChange}
                    className="my-6"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="grid gap-2">
                    <Input
                      id="min"
                      placeholder={`Min ${label}`}
                      value={localValues.min ?? ""}
                      onChange={(e) => handleInputChange("min", e.target.value)}
                      className={cn("h-8", errors.min && "border-red-500")}
                      type="number"
                      min={minValue}
                      max={maxValue}
                    />
                    {errors.min && (
                      <p className="text-xs text-red-500">{errors.min}</p>
                    )}
                  </div>
                  <span className="text-muted-foreground">-</span>
                  <div className="grid gap-2">
                    <Input
                      id="max"
                      placeholder={`Max ${label}`}
                      value={localValues.max ?? ""}
                      onChange={(e) => handleInputChange("max", e.target.value)}
                      className={cn("h-8", errors.max && "border-red-500")}
                      type="number"
                      min={minValue}
                      max={maxValue}
                    />
                    {errors.max && (
                      <p className="text-xs text-red-500">{errors.max}</p>
                    )}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {hasActiveFilter && (
        <Badge
          variant="secondary"
          className="w-fit rounded-sm px-1 font-normal"
        >
          {activeFilter.min !== undefined && activeFilter.max !== undefined
            ? `${activeFilter.min} - ${activeFilter.max}`
            : activeFilter.min !== undefined
            ? `≥ ${activeFilter.min}`
            : `≤ ${activeFilter.max}`}
        </Badge>
      )}
    </div>
  );
}
