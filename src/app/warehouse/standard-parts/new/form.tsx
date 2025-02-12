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
  inventory_category: z
    .object({
      id: z.number(),
      name: z.string(),
      description: z.string().optional(),
    })
    .optional(),
  technical_drawing: z
    .object({
      file: z.instanceof(File).optional(),
      drawing_code: z.string().min(1, "Teknik çizim kodu zorunludur"),
      version: z.string().min(1, "Versiyon zorunludur"),
    })
    .optional(),
});

export type StandardPartFormData = z.infer<typeof standardPartSchema>;
