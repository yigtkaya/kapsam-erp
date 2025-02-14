import { z } from "zod";

// Define the Zod schema for Process Products (Product with type PROCESS)
export const processProductSchema = z.object({
  product_code: z.string().nonempty("Ürün kodu zorunludur"),
  product_name: z.string().nonempty("Ürün adı zorunludur"),
  product_type: z.literal("SEMI"),
  description: z.string().optional(),
  current_stock: z.preprocess(
    (a) => Number(a),
    z.number().min(0, "Mevcut stok negatif olamaz")
  ),
  inventory_category: z.number().optional(),
  // Add additional fields here if necessary
});

export type ProcessProductFormData = z.infer<typeof processProductSchema>;
