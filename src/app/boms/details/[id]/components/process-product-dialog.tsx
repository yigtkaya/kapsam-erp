"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProcessProductFormData,
  processProductSchema,
} from "@/app/warehouse/process/new/form";
import { useCreateProduct } from "@/hooks/useProducts";
import { Product } from "@/types/inventory";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProcessProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessProductDialog({
  open,
  onOpenChange,
}: ProcessProductDialogProps) {
  const { mutateAsync: createProduct } = useCreateProduct();

  const form = useForm<ProcessProductFormData>({
    resolver: zodResolver(processProductSchema),
    defaultValues: {
      product_code: "",
      product_name: "",
      product_type: "SEMI",
      description: "",
      current_stock: 0,
      inventory_category: 2,
    },
  });

  const onSubmit = async (data: ProcessProductFormData) => {
    try {
      const response = await createProduct(data as unknown as Product);
      if (response.success) {
        toast.success("Yarı Mamül ürün başarıyla oluşturuldu");
        onOpenChange(false);
        form.reset();
      } else {
        const error = await response.data;
        toast.error("Ürün oluşturulamadı", {
          description: error,
        });
      }
    } catch (error) {
      toast.error("Form gönderilirken hata oluştu", {
        description:
          error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Proses Ürünü Oluştur</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ürün Kodu</FormLabel>
                  <FormControl>
                    <Input placeholder="Ürün kodu..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ürün Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Ürün adı..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Input placeholder="Açıklama..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mevcut Stok</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Oluştur
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
