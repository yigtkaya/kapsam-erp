"use client";

import { LayoutGrid, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toggle } from "@radix-ui/react-toggle";

interface ViewToggleProps {
  view: "grid" | "table";
  onViewChange: (value: "grid" | "table") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
      <Toggle
        pressed={view === "grid"}
        onPressedChange={() => onViewChange("grid")}
        className={cn(
          "data-[state=on]:bg-background",
          "hover:bg-background/50",
          "hover:text-foreground"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={view === "table"}
        onPressedChange={() => onViewChange("table")}
        className={cn(
          "data-[state=on]:bg-background",
          "hover:bg-background/50",
          "hover:text-foreground"
        )}
      >
        <Table2 className="h-4 w-4" />
      </Toggle>
    </div>
  );
}
