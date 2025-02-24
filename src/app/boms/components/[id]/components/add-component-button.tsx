"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProducts } from "@/hooks/useProducts";
import { useAddBOMComponent } from "@/hooks/useBOMs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProductType as ManufactureProductType } from "@/types/manufacture";
import { Separator } from "@/components/ui/separator";
import { useRouteParams } from "@/hooks/useRouteParams";

const formSchema = z.object({
  component: z.string().min(1, "Bileşen seçimi gereklidir"),
  quantity: z.coerce.number().positive("Miktar pozitif bir sayı olmalıdır"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddComponentButtonProps {
  bomId?: number; // Make bomId optional
}

export function AddComponentButton({
  bomId: propBomId,
}: AddComponentButtonProps = {}) {
  const [open, setOpen] = useState(false);
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { mutate: addComponent, isPending } = useAddBOMComponent();
  const router = useRouter();
  const params = useRouteParams<{ id: string }>();

  // Use the bomId from props if provided, otherwise use the id from the route params
  const bomId = propBomId || Number(params.id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      component: "",
      quantity: 1,
      notes: "",
    },
  });

  function onSubmit(values: FormValues) {
    const now = new Date().toISOString();
    const selectedProduct = products?.find(
      (p) => p.id.toString() === values.component
    );

    if (!selectedProduct) {
      toast.error("Seçilen ürün bulunamadı");
      return;
    }

    // Map inventory ProductType to manufacture ProductType
    const mapProductType = (type: string): ManufactureProductType => {
      switch (type) {
        case "SINGLE":
          return ManufactureProductType.SINGLE;
        case "SEMI":
          return ManufactureProductType.SEMI;
        case "MONTAGED":
          return ManufactureProductType.MONTAGED;
        case "STANDARD_PART":
          return ManufactureProductType.STANDARD_PART;
        default:
          return ManufactureProductType.SINGLE;
      }
    };

    addComponent(
      {
        bomId,
        component: {
          component: values.component,
          quantity: values.quantity,
          notes: values.notes,
          sequence_order: 1, // Default sequence order
          component_type: "PRODUCT", // Default component type
          bom: bomId,
          created_at: now,
          updated_at: now,
          details: {
            type: "PRODUCT",
            product: {
              id: parseInt(values.component),
              product_code: selectedProduct.product_code,
              name: selectedProduct.product_name,
              product_type: mapProductType(selectedProduct.product_type),
            },
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Bileşen başarıyla eklendi");
          form.reset();
          setOpen(false);
          router.refresh();
        },
        onError: (error: Error) => {
          toast.error(`Bileşen eklenirken hata oluştu: ${error.message}`);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Bileşen Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bileşen Ekle</DialogTitle>
          <DialogDescription>
            Reçeteye yeni bir bileşen ekleyin. Tüm gerekli alanları doldurun.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-2" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="component"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bileşen*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingProducts}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Bileşen seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products?.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">
                              {product.product_code}
                            </span>
                            <span>{product.product_name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Miktar*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Miktar girin"
                      {...field}
                    />
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
                    <Textarea
                      placeholder="Bileşen hakkında notlar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Ekleniyor..." : "Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
