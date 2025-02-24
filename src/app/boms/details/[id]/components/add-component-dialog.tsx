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
import { useState } from "react";
import { ProcessForm } from "./process-form";
import { ProductForm } from "./product-form";
import { Plus, Cog, Package } from "lucide-react";

interface AddComponentDialogProps {
  bomId: number;
  trigger?: React.ReactNode;
}

type ComponentType = "PROCESS" | "PRODUCT";

export function AddComponentDialog({
  bomId,
  trigger,
}: AddComponentDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"select" | "form">("select");
  const [selectedType, setSelectedType] = useState<ComponentType | null>(null);

  const handleTypeSelect = (type: ComponentType) => {
    setSelectedType(type);
    setStep("form");
  };

  const handleClose = () => {
    setOpen(false);
    setStep("select");
    setSelectedType(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Komponent Ekle
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === "select"
              ? "Komponent Ekle"
              : selectedType === "PROCESS"
              ? "Proses Ekle"
              : "Mamül Ekle"}
          </DialogTitle>
          <DialogDescription>
            {step === "select"
              ? "Eklemek istediğiniz komponentin tipini seçiniz"
              : selectedType === "PROCESS"
              ? "Proses detaylarını doldurunuz"
              : "Mamül detaylarını doldurunuz"}
          </DialogDescription>
        </DialogHeader>

        {step === "select" ? (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-32 flex flex-col gap-4"
              onClick={() => handleTypeSelect("PROCESS")}
            >
              <Cog className="h-8 w-8" />
              <span>Proses</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-32 flex flex-col gap-4"
              onClick={() => handleTypeSelect("PRODUCT")}
            >
              <Package className="h-8 w-8" />
              <span>Mamül</span>
            </Button>
          </div>
        ) : (
          <>
            {selectedType === "PROCESS" && (
              <ProcessForm bomId={bomId} onClose={handleClose} />
            )}
            {selectedType === "PRODUCT" && (
              <ProductForm bomId={bomId} onClose={handleClose} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
