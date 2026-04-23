import {z} from "zod";

export const createProductTagSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  companyId: z.string(),
});

export const updateProductTagSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export type createProductTagDTO = z.infer<typeof createProductTagSchema>;
export type updateProductTagDTO = z.infer<typeof updateProductTagSchema>;