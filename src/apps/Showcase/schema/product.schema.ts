import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  original_price: z.number().optional(),
  price: z.number(),
  comapany_id: z.string(),
  product_category_id: z.string(),
  tags: z.array(z.string()).optional(),
  stock: z.number().optional(),
});

// DTO type inferred from schema
export type CreateProductDTO = z.infer<typeof createProductSchema>;