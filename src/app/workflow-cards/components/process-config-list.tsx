"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProcessConfig } from "@/types/manufacture";
import {
  useProcessConfigs,
  useDeleteProcessConfig,
} from "@/hooks/useManufacturing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProcessConfigListProps {
  workflowProcessId: number;
}

export function ProcessConfigList({
  workflowProcessId,
}: ProcessConfigListProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<number | null>(null);

  const {
    data: processConfigs,
    isLoading,
    error,
  } = useProcessConfigs(workflowProcessId);

  const { mutate: deleteProcessConfig, isPending: isDeleting } =
    useDeleteProcessConfig();

  const handleDeleteClick = (configId: number) => {
    setConfigToDelete(configId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (configToDelete) {
      deleteProcessConfig(configToDelete, {
        onSuccess: () => {
          toast.success("Process configuration deleted successfully");
          setDeleteDialogOpen(false);
          setConfigToDelete(null);
        },
        onError: (error) => {
          toast.error(
            `Failed to delete process configuration: ${error.message}`
          );
        },
      });
    }
  };

  const handleAddConfig = () => {
    router.push(`/workflow-cards/${workflowProcessId}/config/new`);
  };

  const handleEditConfig = (configId: number) => {
    router.push(`/workflow-cards/${workflowProcessId}/config/${configId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-800">
        Failed to load process configurations: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Process Configurations</h2>
        <Button onClick={handleAddConfig}>
          <Plus className="h-4 w-4 mr-2" />
          Add Configuration
        </Button>
      </div>

      {processConfigs && processConfigs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {processConfigs.map((config) => (
            <ConfigCard
              key={config.id}
              config={config}
              onEdit={() => handleEditConfig(config.id)}
              onDelete={() => handleDeleteClick(config.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                No Configurations Found
              </h3>
              <p className="text-muted-foreground">
                This workflow process doesn't have any configuration details.
              </p>
              <Button className="mt-4" onClick={handleAddConfig}>
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              process configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ConfigCardProps {
  config: ProcessConfig;
  onEdit: () => void;
  onDelete: () => void;
}

function ConfigCard({ config, onEdit, onDelete }: ConfigCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle>
            {config.machine_type_display ||
              config.machine_type ||
              "Configuration"}
          </CardTitle>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {config.axis_count && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Axis Count
              </h3>
              <p className="text-lg">
                <Badge variant="outline">
                  {config.axis_count_display || config.axis_count}
                </Badge>
              </p>
            </div>
          )}

          {config.estimated_duration_minutes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Estimated Duration
              </h3>
              <p className="text-lg">
                {config.estimated_duration_minutes} minutes
              </p>
            </div>
          )}

          {config.setup_time_minutes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Setup Time
              </h3>
              <p className="text-lg">{config.setup_time_minutes} minutes</p>
            </div>
          )}
        </div>

        {config.raw_material_details && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Raw Material
            </h3>
            <div className="bg-muted p-2 rounded-md">
              <p className="font-medium">
                {config.raw_material_details.material_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {config.raw_material_details.material_code}
              </p>
            </div>
          </div>
        )}

        {config.tooling_requirements && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Tooling Requirements
            </h3>
            <p className="text-sm whitespace-pre-wrap">
              {config.tooling_requirements}
            </p>
          </div>
        )}

        {config.quality_checks && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Quality Checks
            </h3>
            <p className="text-sm whitespace-pre-wrap">
              {config.quality_checks}
            </p>
          </div>
        )}

        {config.notes && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Notes
            </h3>
            <p className="text-sm whitespace-pre-wrap">{config.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
