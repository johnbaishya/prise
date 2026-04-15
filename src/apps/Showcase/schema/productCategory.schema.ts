import {z} from "zod";

export const createProductCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  company_id: z.string(),
});

export const updateProductCategorySchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export type createProductCategoryDTO = z.infer<typeof createProductCategorySchema>;
export type updateProductCategoryDTO = z.infer<typeof updateProductCategorySchema>;
