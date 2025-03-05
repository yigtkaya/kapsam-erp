"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateStockCardDialog() {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Yeni Stok Tanıtım Kartı
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base font-sm">
            Stok Kartı Türü Seçin
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Oluşturmak istediğiniz stok kartı türünü seçin.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <button
            className="flex flex-col items-center justify-center p-6 rounded-lg border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
            onClick={() => router.push("/stock-cards/product/new")}
          >
            <span className="text-sm font-medium mb-1">Ürün</span>
            <span className="text-xs text-muted-foreground text-center">
              Üretilen veya satılan ürünler için
            </span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-6 rounded-lg border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
            onClick={() => router.push("/stock-cards/raw-material/new")}
          >
            <span className="text-sm font-medium mb-1">Hammadde</span>
            <span className="text-xs text-muted-foreground text-center">
              Üretimde kullanılan hammaddeler için
            </span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-6 rounded-lg border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
            onClick={() => router.push("/stock-cards/tools-holders/new")}
          >
            <span className="text-sm font-medium mb-1">Takımlar</span>
            <span className="text-xs text-muted-foreground text-center">
              Üretim takımları için
            </span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-6 rounded-lg border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
            onClick={() => router.push("/stock-cards/tools-holders/new")}
          >
            <span className="text-sm font-medium mb-1">Tutucular</span>
            <span className="text-xs text-muted-foreground text-center">
              Üretim tutucuları için
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
