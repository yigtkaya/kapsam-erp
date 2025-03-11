"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxisCount, MachineType } from "@/types/manufacture";
import { useProducts } from "@/hooks/useProducts";
import {
  useProcesses,
  useCreateWorkflowProcess,
  useCreateProcessConfig,
} from "@/hooks/useManufacturing";
import { useRawMaterials } from "@/hooks/useRawMaterials";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Schema for the workflow process
const workflowProcessSchema = z.object({
  product: z.number().or(z.string()),
  process: z.number(),
  stock_code: z.string().min(1, "Stock code is required"),
  sequence_order: z.number().min(1, "Sequence order is required"),
});

type FormValues = z.infer<typeof workflowProcessSchema>;

export function WorkflowProcessForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [openProduct, setOpenProduct] = useState(false);
  const [openProcess, setOpenProcess] = useState(false);

  const { data: products, isLoading: productsLoading } = useProducts({});
  const { data: processes, isLoading: processesLoading } = useProcesses();
  const { data: rawMaterials, isLoading: rawMaterialsLoading } =
    useRawMaterials({});
  const { mutateAsync: createWorkflowProcess } = useCreateWorkflowProcess();
  const { mutateAsync: createProcessConfig } = useCreateProcessConfig();

  const form = useForm<FormValues>({
    resolver: zodResolver(workflowProcessSchema),
    defaultValues: {
      process: 0,
      product: 0,
      stock_code: "",
      sequence_order: 1,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // First create the workflow process
      const workflowProcess = await createWorkflowProcess(data as any);

      // Then create the process config using the workflow-specific endpoint
      if (workflowProcess.id) {
        await createProcessConfig({
          workflow_process: workflowProcess.id,
          ...data,
        } as any);
      }

      toast.success("Workflow process created successfully");
      router.push("/workflow-cards");
    } catch (error) {
      console.error("Error creating workflow process:", error);
      toast.error("Failed to create workflow process");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = productsLoading || processesLoading || rawMaterialsLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>İş akışı bilgilerini giriniz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ürün</FormLabel>
                        <Popover
                          open={openProduct}
                          onOpenChange={setOpenProduct}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openProduct}
                                className="w-full justify-between"
                              >
                                {field.value
                                  ? products?.find(
                                      (product) =>
                                        product.id.toString() ===
                                        field.value.toString()
                                    )?.product_name
                                  : "Ürün seçiniz"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0">
                            <Command>
                              <CommandInput placeholder="Ürün ara..." />
                              <CommandEmpty>Ürün bulunamadı.</CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {products?.map((product) => (
                                    <CommandItem
                                      value={product.product_name}
                                      key={product.id}
                                      onSelect={() => {
                                        field.onChange(product.id);
                                        setOpenProduct(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value?.toString() ===
                                            product.id.toString()
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {product.product_name} (
                                      {product.product_code})
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Bu iş akışı işlemi hangi ürüne ait
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="process"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Operasyon</FormLabel>
                        <Popover
                          open={openProcess}
                          onOpenChange={setOpenProcess}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openProcess}
                                className="w-full justify-between"
                              >
                                {field.value
                                  ? processes?.find(
                                      (process) =>
                                        process.id.toString() ===
                                        field.value.toString()
                                    )?.process_name
                                  : "Operasyon seçiniz"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0">
                            <Command>
                              <CommandInput placeholder="Operasyon ara..." />
                              <CommandEmpty>Operasyon bulunamadı.</CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {processes?.map((process) => (
                                    <CommandItem
                                      value={process.process_name}
                                      key={process.id}
                                      onSelect={() => {
                                        field.onChange(process.id);
                                        setOpenProcess(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value?.toString() ===
                                            process.id.toString()
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {process.process_name} (
                                      {process.process_code})
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Bu iş akışı işlemi hangi işlemi içerir
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stok Kodu</FormLabel>
                        <FormControl>
                          <Input placeholder="Stok kodunu giriniz" {...field} />
                        </FormControl>
                        <FormDescription>
                          İşlem çıktısı için stok kodu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sequence_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sıra</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Sıra numarasını giriniz"
                            value={field.value?.toString()}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? parseInt(value) : 1);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormDescription>
                          Bu işlemin ürünün iş akışı içindeki sırası
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4" /> : null}
                    Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </form>
    </Form>
  );
}
