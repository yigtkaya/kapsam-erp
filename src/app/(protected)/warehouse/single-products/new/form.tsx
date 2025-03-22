import { z } from "zod";

// Define the Zod schema for Finished Products (Product with type MONTAGED)
export const montagedProductSchema = z.object({
  product_code: z.string().nonempty("Ürün kodu zorunludur"),
  product_name: z.string().nonempty("Ürün adı zorunludur"),
  product_type: z.literal("SINGLE"),
  description: z.string().optional(),
  current_stock: z.preprocess(
    (a) => Number(a),
    z.number().min(0, "Mevcut stok negatif olamaz")
  ),
  inventory_category: z.number().optional(),
  // technical_drawing can be added later if needed
});

export type MontagedProductFormData = z.infer<typeof montagedProductSchema>;
