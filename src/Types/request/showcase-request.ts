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






export const listProductsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(100).default(10).optional(),
    
    search: z.string().optional(),
    
    tag: z.string().optional(),
    category: z.string().optional(),
    
    sortBy: z.enum(["createdAt", "price"]).default("createdAt").optional(),
    order: z.enum(["asc", "desc"]).default("desc").optional(),
});





export const createProductCategorySchema = z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    companyId: z.string(),
});

export const updateProductCategorySchema = z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
});



export const listProductCategoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(100).default(10).optional(),
    search: z.string().optional(),
    sortBy: z.enum(["createdAt", "name"]).default("createdAt").optional(),
    order: z.enum(["asc", "desc"]).default("asc").optional(),
});



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



export const listProductTagQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(100).default(10).optional(),
    search: z.string().optional(),
    sortBy: z.enum(["createdAt", "name"]).default("createdAt").optional(),
    order: z.enum(["asc", "desc"]).default("asc").optional(),
});



export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
export type ListProductsQueryDTO = z.infer<typeof listProductsQuerySchema>;

export type createProductCategoryDTO = z.infer<typeof createProductCategorySchema>;
export type updateProductCategoryDTO = z.infer<typeof updateProductCategorySchema>;
export type ListProductCategoryQueryDTO = z.infer<typeof listProductCategoryQuerySchema>;

export type createProductTagDTO = z.infer<typeof createProductTagSchema>;
export type updateProductTagDTO = z.infer<typeof updateProductTagSchema>;
export type ListProductTagQueryDTO = z.infer<typeof listProductTagQuerySchema>;
