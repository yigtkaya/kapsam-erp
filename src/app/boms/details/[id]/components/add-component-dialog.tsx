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
import { Cog, Package, ArrowLeft, ListPlus } from "lucide-react";
import { CreateProcessForm } from "@/app/manufacturing/processes/components/create-process-form";
import { cn } from "@/lib/utils";
import { ProcessProductForm } from "./process-product-form";

interface AddComponentDialogProps {
  bomId: number;
  trigger?: React.ReactNode;
}

type ComponentType = "PRODUCT" | "PROCESS";

export function AddComponentDialog({
  bomId,
  trigger,
}: AddComponentDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<
    "select" | "form" | "create-process" | "create-process-product"
  >("select");
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

  const handleCreateProcess = () => {
    setStep("create-process");
  };

  const handleCreateProcessProduct = () => {
    setStep("create-process-product");
  };

  const handleBackToForm = () => {
    setStep("form");
  };

  const handleProcessCreated = () => {
    setStep("form");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <ListPlus className="h-4 w-4" />
            Komponent Ekle
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "sm:max-w-[800px] max-h-[90vh] overflow-y-auto",
          step === "create-process" ? "sm:max-w-[800px]" : "sm:max-w-[600px]"
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {step === "select"
              ? "Komponent Ekle"
              : step === "create-process"
              ? "Yeni Proses Oluştur"
              : step === "create-process-product"
              ? "Yeni Proses Ürünü Oluştur"
              : selectedType === "PROCESS"
              ? "Proses Ekle"
              : "Mamül Ekle"}
          </DialogTitle>
          <DialogDescription>
            {step === "select"
              ? "Eklemek istediğiniz komponentin tipini seçiniz"
              : step === "create-process"
              ? "Yeni bir proses oluşturun ve reçeteye ekleyin"
              : step === "create-process-product"
              ? "Yeni bir proses ürünü oluşturun"
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
              className="h-32 flex flex-col gap-4 hover:bg-green-50 hover:border-green-200 transition-colors"
              onClick={() => handleTypeSelect("PROCESS")}
            >
              <Cog className="h-8 w-8 text-green-600" />
              <div className="flex flex-col items-center">
                <span className="font-medium">Proses</span>
                <span className="text-xs text-muted-foreground mt-1">
                  İşlem veya operasyon ekle
                </span>
              </div>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-32 flex flex-col gap-4 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              onClick={() => handleTypeSelect("PRODUCT")}
            >
              <Package className="h-8 w-8 text-blue-600" />
              <div className="flex flex-col items-center">
                <span className="font-medium">Mamül</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Ürün veya malzeme ekle
                </span>
              </div>
            </Button>
          </div>
        ) : step === "create-process" ? (
          <div className="space-y-4">
            <Button
              variant="outline"
              size="sm"
              className="mb-4"
              onClick={handleBackToForm}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
            <CreateProcessForm
              onSuccess={handleProcessCreated}
              isDialog={true}
            />
          </div>
        ) : step === "create-process-product" ? (
          <div className="space-y-4">
            <Button
              variant="outline"
              size="sm"
              className="mb-4"
              onClick={handleBackToForm}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
            <ProcessProductForm onClose={handleBackToForm} />
          </div>
        ) : (
          <>
            {selectedType === "PROCESS" && (
              <div className="space-y-4">
                <ProcessForm
                  bomId={bomId}
                  onClose={handleClose}
                  onCreateProcess={handleCreateProcess}
                  onCreateProcessProduct={handleCreateProcessProduct}
                />
              </div>
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
