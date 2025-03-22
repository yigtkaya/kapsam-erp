import { useProducts } from "@/hooks/useProducts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";
import { useCreateComponent } from "@/hooks/useComponents";

const formSchema = z.object({
  component: z.string().min(1, "Ürün seçilmesi zorunludur"),
  sequence_order: z.coerce.number().min(1, "Sıra numarası 1'den küçük olamaz"),
  quantity: z.string().min(1, "Miktar girilmesi zorunludur"),
  notes: z.string().optional(),
});

interface AddComponentDialogProps {
  bomId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CreateBOMComponentRequest {
  bom: number;
  sequence_order: number;
  quantity: string;
  product: number;
  lead_time_days?: number | null;
  notes?: string | null;
}

export function AddComponentDialog({
  bomId,
  open,
  onOpenChange,
}: AddComponentDialogProps) {
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { mutate: addComponent, isPending } = useCreateComponent(bomId);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products?.filter((product) => {
    if (!searchQuery) return true;

    const search = searchQuery.toLowerCase().trim();
    return (
      product.product_name.toLowerCase().includes(search) ||
      product.product_code.toLowerCase().includes(search)
    );
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sequence_order: 1,
      quantity: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedProduct = products?.find(
      (p) => p.id.toString() === values.component
    );

    const component: CreateBOMComponentRequest = {
      bom: bomId,
      sequence_order: values.sequence_order,
      quantity: values.quantity,
      product: parseInt(values.component),
      notes: values.notes || null,
    };

    addComponent(component, {
      onSuccess: () => {
        toast.success("Bileşen başarıyla eklendi.");
        form.reset();
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Makine oluşturulurken bir hata oluştu"
        );
        console.error("API Error:", error);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Bileşen Ekle</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="component"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ürün</FormLabel>
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <ShadcnButton
                          variant="outline"
                          role="combobox"
                          disabled={isLoadingProducts}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? `${
                                products?.find(
                                  (product) =>
                                    product.id.toString() === field.value
                                )?.product_name
                              } (${
                                products?.find(
                                  (product) =>
                                    product.id.toString() === field.value
                                )?.product_code
                              })`
                            : "Ürün seçin"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </ShadcnButton>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandList className="max-h-[300px] overflow-y-auto">
                          <CommandInput
                            placeholder="Ürün ara..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandEmpty>Ürün bulunamadı.</CommandEmpty>
                          <CommandGroup>
                            {filteredProducts?.map((product) => (
                              <CommandItem
                                value={`${product.product_name} (${product.product_code})`}
                                key={product.id}
                                onSelect={() => {
                                  form.setValue(
                                    "component",
                                    product.id.toString()
                                  );
                                  setComboboxOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    product.id.toString() === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {product.product_name} ({product.product_code})
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Miktar</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notlar</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ekle
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
