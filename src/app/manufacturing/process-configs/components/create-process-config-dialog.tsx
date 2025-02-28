"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ProcessConfigForm } from "./process-config-form";
import { CreateProcessDialog } from "../../processes/components/create-process-dialog";
import { useProcesses } from "@/hooks/useManufacturing";

interface CreateProcessConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateProcessConfigDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateProcessConfigDialogProps) {
  const [createProcessOpen, setCreateProcessOpen] = useState(false);
  const { data: processes = [] } = useProcesses();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogDescription>
              Yeni bir proses yapılandırması oluşturmak için aşağıdaki formu
              doldurun.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ProcessConfigForm
              processes={processes}
              isDialog
              onCreateProcess={() => setCreateProcessOpen(true)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <CreateProcessDialog
        open={createProcessOpen}
        onOpenChange={setCreateProcessOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}
