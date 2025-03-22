import { z } from "zod";

// Define the Zod schema for Standard Parts (Product with type STANDARD_PART)
export const standardPartSchema = z.object({
  product_code: z.string().nonempty("Parça kodu zorunludur"),
  product_name: z.string().nonempty("Parça adı zorunludur"),
  product_type: z.literal("STANDARD_PART"),
  description: z.string().optional(),
  current_stock: z.preprocess(
    (a) => Number(a),
    z.number().min(0, "Mevcut stok negatif olamaz")
  ),
  inventory_category: z.number().optional(),
  // technical_drawing: z
  //   .object({
  //     drawing_file: z.instanceof(File).optional(),
  //     drawing_code: z.string().min(1, "Teknik çizim kodu zorunludur"),
  //     version: z.string().min(1, "Versiyon zorunludur"),
  //     effective_date: z.string().default(() => new Date().toISOString()),
  //   })
  //   .optional(),
});

export type StandardPartFormData = z.infer<typeof standardPartSchema>;
