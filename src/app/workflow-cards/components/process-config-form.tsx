"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxisCount, MachineType, ProcessConfig } from "@/types/manufacture";
import {
  useCreateProcessConfig,
  useUpdateProcessConfig,
  useProcessConfig,
} from "@/hooks/useManufacturing";
import { useRawMaterials } from "@/hooks/useRawMaterials";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Schema for the process configuration
const formSchema = z.object({
  raw_material: z.number().optional().nullable(),
  axis_count: z.nativeEnum(AxisCount).optional().nullable(),
  estimated_duration_minutes: z.coerce.number().optional().nullable(),
  tooling_requirements: z.string().optional().default(""),
  quality_checks: z.string().optional().default(""),
  machine_type: z.nativeEnum(MachineType).optional().nullable(),
  setup_time_minutes: z.coerce.number().optional().nullable(),
  notes: z.string().optional().default(""),
});

type FormValues = z.infer<typeof formSchema>;

interface ProcessConfigFormProps {
  workflowProcessId: number;
  configId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProcessConfigForm({
  workflowProcessId,
  configId,
  onSuccess,
  onCancel,
}: ProcessConfigFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!configId;

  const { data: rawMaterials, isLoading: rawMaterialsLoading } =
    useRawMaterials({});
  const { data: existingConfig, isLoading: configLoading } = useProcessConfig(
    isEditing ? (configId as number) : 0
  );
  const { mutateAsync: createProcessConfig } = useCreateProcessConfig();
  const { mutateAsync: updateProcessConfig } = useUpdateProcessConfig();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estimated_duration_minutes: null,
      tooling_requirements: "",
      quality_checks: "",
      setup_time_minutes: null,
      notes: "",
    },
  });

  // Load existing data when editing
  useEffect(() => {
    if (isEditing && existingConfig) {
      form.reset({
        raw_material:
          typeof existingConfig.raw_material === "number"
            ? existingConfig.raw_material
            : existingConfig.raw_material?.id,
        axis_count: existingConfig.axis_count,
        estimated_duration_minutes:
          existingConfig.estimated_duration_minutes || null,
        tooling_requirements: existingConfig.tooling_requirements || "",
        quality_checks: existingConfig.quality_checks || "",
        machine_type: existingConfig.machine_type,
        setup_time_minutes: existingConfig.setup_time_minutes || null,
        notes: existingConfig.notes || "",
      });
    }
  }, [isEditing, existingConfig, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Convert all null values to undefined to satisfy the type
      const processedData = {
        ...data,
        raw_material:
          data.raw_material === null ? undefined : data.raw_material,
        axis_count: data.axis_count === null ? undefined : data.axis_count,
        machine_type:
          data.machine_type === null ? undefined : data.machine_type,
        estimated_duration_minutes:
          data.estimated_duration_minutes === null
            ? undefined
            : data.estimated_duration_minutes,
        setup_time_minutes:
          data.setup_time_minutes === null
            ? undefined
            : data.setup_time_minutes,
      };

      if (isEditing && configId) {
        await updateProcessConfig({
          id: configId,
          data: {
            ...processedData,
            workflow_process: workflowProcessId,
          },
        });
        toast.success("Process configuration updated successfully");
      } else {
        await createProcessConfig({
          ...processedData,
          workflow_process: workflowProcessId,
        } as any);
        toast.success("Process configuration created successfully");
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving process configuration:", error);
      toast.error(
        `Failed to ${isEditing ? "update" : "create"} process configuration`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = rawMaterialsLoading || (isEditing && configLoading);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit" : "Add"} Process Configuration
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the configuration details for this workflow process"
            : "Add a new configuration to this workflow process"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="machine_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Machine Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select machine type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {Object.entries(MachineType).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Type of machine used</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="axis_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Axis Count</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select axis count" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {Object.entries(AxisCount).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Number of axes for the machine
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="raw_material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raw Material</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={(value) =>
                        field.onChange(value ? parseInt(value) : null)
                      }
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select raw material" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {rawMaterials?.map((material) => (
                          <SelectItem
                            key={material.id}
                            value={material.id.toString()}
                          >
                            {material.material_name} ({material.material_code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Raw material used in this process
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimated_duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter duration"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? null : parseInt(value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Estimated time to complete this process
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="setup_time_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setup Time (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter setup time"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? null : parseInt(value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Time required to set up the machine
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tooling_requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tooling Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter tooling requirements"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tools and equipment needed for this process
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quality_checks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quality Checks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter quality checks"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Quality control procedures for this process
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter additional notes"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional information about this process configuration
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Update" : "Create"} Configuration
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
