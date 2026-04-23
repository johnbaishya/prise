import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  originalPrice: z.number().optional(),
  price: z.number(),
  companyId: z.string(),
  productCategoryId: z.string(),
  tags: z.array(z.string()).optional(),
  stock: z.number().optional(),
});

// DTO type inferred from schema
export type CreateProductDTO = z.infer<typeof createProductSchema>;


export const updateProductSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional() ,
  description: z.string().optional(),
  originalPrice: z.number().optional(),
  price: z.number().optional(),
  productCategoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  stock: z.number().optional(),
});

export type UpdateProductDTO = z.infer<typeof updateProductSchema>;




export const listProductsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),

  search: z.string().optional(),

  tag: z.string().optional(),
  category: z.string().optional(),

  sortBy: z.enum(["createdAt", "price"]).default("createdAt").optional(),
  order: z.enum(["asc", "desc"]).default("desc").optional(),
});

export type ListProductsQueryDTO = z.infer<typeof listProductsQuerySchema>;