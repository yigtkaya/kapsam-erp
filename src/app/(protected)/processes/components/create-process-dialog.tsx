"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CreateProcessForm } from "./create-process-form";

interface CreateProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateProcessDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateProcessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yeni Süreç Oluştur</DialogTitle>
          <DialogDescription>
            Yeni bir üretim süreci oluşturmak için aşağıdaki formu doldurun.
          </DialogDescription>
        </DialogHeader>
        <CreateProcessForm isDialog onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
