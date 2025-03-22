"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { StandardPartFormData, standardPartSchema } from "./form";
import { useCreateProduct } from "@/hooks/useProducts";
import { Product, TechnicalDrawing } from "@/types/inventory";
import { useCreateTechnicalDrawing } from "@/hooks/useProducts";
export default function NewStandardPartPage() {
  const router = useRouter();
  const { mutateAsync: createProduct, isPending } = useCreateProduct();
  const { mutateAsync: createTechnicalDrawing } = useCreateTechnicalDrawing();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<StandardPartFormData>({
    resolver: zodResolver(standardPartSchema),
    defaultValues: {
      product_code: "",
      product_name: "",
      product_type: "STANDARD_PART",
      description: "",
      current_stock: 0,
      inventory_category: 1,
      // technical_drawing: {
      //   drawing_code: "",
      //   version: "1.0",
      // },
    },
  });

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     // Update form
  //     form.setValue("technical_drawing.drawing_file", file);

  //     // Create preview URL
  //     const url = URL.createObjectURL(file);
  //     setPreviewUrl(url);

  //     // Clean up old preview URL when component unmounts
  //     return () => URL.revokeObjectURL(url);
  //   }
  // };

  // const removeFile = () => {
  //   form.setValue("technical_drawing.drawing_file", undefined);
  //   if (previewUrl) {
  //     URL.revokeObjectURL(previewUrl);
  //     setPreviewUrl(null);
  //   }
  // };

  const onSubmit = async (data: StandardPartFormData) => {
    try {
      console.log("pressed");
      const response = await createProduct(data as Product);

      if (response.success) {
        toast.success("Standart parça başarıyla oluşturuldu");
        router.back();
        return;
        //  if (data.technical_drawing?.drawing_file) {
        //   const technicalDrawingResponse = await createTechnicalDrawing({
        //     technicalDrawing: {
        //       drawing_code: data.technical_drawing?.drawing_code || "",
        //       version: data.technical_drawing?.version || "1.0",
        //       drawing_file: data.technical_drawing?.drawing_file,
        //       effective_date: new Date().toISOString(),
        //     } as unknown as TechnicalDrawing,
        //     product_id: response.data.id,
        //   });
        //   if (technicalDrawingResponse.success) {
        //     toast.success("Standart parça başarıyla oluşturuldu");
        //     router.back();
        //   } else {
        //     toast.error("Teknik çizim oluşturulamadı", {
        //       description: technicalDrawingResponse.message,
        //     });
        //   }
        // }
      } else {
        const error = await response.data;
        toast.error("Standart parça oluşturulamadı", {
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

  const oUploadPhoto = async (drawing_file: File) => {
    const technicalDrawingResponse = await createTechnicalDrawing({
      technicalDrawing: {
        drawing_code: "123",
        version: "1.0",
        drawing_file: drawing_file,
        effective_date: new Date().toISOString(),
      } as unknown as TechnicalDrawing,
      product_id: 1,
    });

    if (technicalDrawingResponse.success) {
      toast.success("Resim başarıyla yüklendi");
    } else {
      toast.error("Resim yüklenemedi", {
        description: technicalDrawingResponse.message,
      });
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Yeni Standart Parça Ekle</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium mb-2">Temel Bilgiler</h3>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="product_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parça Kodu</FormLabel>
                    <FormControl>
                      <Input placeholder="Parça kodunu girin" {...field} />
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
                    <FormLabel>Parça Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Parça adını girin" {...field} />
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
              <FormItem>
                <FormLabel>Parça Tipi</FormLabel>
                <div className="flex items-center h-10">
                  <Badge variant="secondary">Standart Parça</Badge>
                </div>
                <FormDescription>
                  Bu alan otomatik olarak atanır ve değiştirilemez
                </FormDescription>
              </FormItem>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium mb-2">Açıklama</h3>
            <Separator className="mb-4" />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Parça hakkında açıklama girin"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Technical Drawing */}
          {/* <div>
            <h3 className="text-lg font-medium mb-2">Teknik Çizim</h3>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="technical_drawing.drawing_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Çizim Kodu</FormLabel>
                    <FormControl>
                      <Input placeholder="Çizim kodunu girin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="technical_drawing.version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Versiyon</FormLabel>
                    <FormControl>
                      <Input placeholder="Versiyon numarası" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="technical-drawing">Teknik Çizim Dosyası</Label>
              <div className="mt-2">
                {!previewUrl ? (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="technical-drawing"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            Dosya yüklemek için tıklayın
                          </span>{" "}
                          veya sürükleyip bırakın
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG veya PDF (Max. 10MB)
                        </p>
                      </div>
                      <input
                        id="technical-drawing"
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                    {previewUrl.endsWith(".pdf") ? (
                      <div className="flex items-center justify-center w-full h-full bg-gray-100">
                        <p className="text-gray-500">Fotoğraf Yüklendi</p>
                      </div>
                    ) : (
                      <Image
                        src={previewUrl}
                        alt="Technical Drawing Preview"
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    )}
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div> */}

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Oluşturuluyor..."
              : "Standart Parça Oluştur"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
