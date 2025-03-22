"use client";

import { LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  view: "grid" | "table";
  onViewChange: (view: "grid" | "table") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 border rounded-md p-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-2",
          view === "grid" ? "bg-muted" : "hover:bg-transparent"
        )}
        onClick={() => onViewChange("grid")}
      >
        <LayoutGrid className="h-4 w-4" />
        Grid
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-2",
          view === "table" ? "bg-muted" : "hover:bg-transparent"
        )}
        onClick={() => onViewChange("table")}
      >
        <Table2 className="h-4 w-4" />
        Tablo
      </Button>
    </div>
  );
}
