"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "./button";

interface PaginationControlProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function PaginationControl({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationControlProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex w-[100px] items-center justify-start text-sm text-muted-foreground">
        Sayfa {currentPage + 1} / {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(0)}
          disabled={!canGoPrevious}
        >
          <span className="sr-only">İlk sayfa</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
        >
          <span className="sr-only">Önceki sayfa</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
        >
          <span className="sr-only">Sonraki sayfa</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={!canGoNext}
        >
          <span className="sr-only">Son sayfa</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex w-[100px] items-center justify-end text-sm text-muted-foreground">
        {totalItems} öğe
      </div>
    </div>
  );
}
