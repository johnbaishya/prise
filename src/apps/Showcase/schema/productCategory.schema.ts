import {z} from "zod";

export const createProductCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  company_id: z.string(),
});

export type createProductCategoryDTO = z.infer<typeof createProductCategorySchema>;

