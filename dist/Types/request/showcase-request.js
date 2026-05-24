"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductTagQuerySchema = exports.updateProductTagSchema = exports.createProductTagSchema = exports.listProductCategoryQuerySchema = exports.updateProductCategorySchema = exports.createProductCategorySchema = exports.listProductsQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    originalPrice: zod_1.z.coerce.number().optional(),
    price: zod_1.z.coerce.number(),
    companyId: zod_1.z.string(),
    productCategoryId: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    stock: zod_1.z.number().optional(),
});
// DTO type inferred from schema
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    originalPrice: zod_1.z.number().optional(),
    price: zod_1.z.number().optional(),
    productCategoryId: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    stock: zod_1.z.number().optional(),
});
exports.listProductsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10).optional(),
    search: zod_1.z.string().optional(),
    tag: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(["createdAt", "price", "name"]).default("createdAt").optional(),
    order: zod_1.z.enum(["asc", "desc"]).default("desc").optional(),
});
exports.createProductCategorySchema = zod_1.z.object({
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    companyId: zod_1.z.string(),
    image: zod_1.z.string().optional(),
});
exports.updateProductCategorySchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
});
exports.listProductCategoryQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10).optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(["createdAt", "name"]).default("createdAt").optional(),
    order: zod_1.z.enum(["asc", "desc"]).default("asc").optional(),
});
exports.createProductTagSchema = zod_1.z.object({
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    companyId: zod_1.z.string(),
});
exports.updateProductTagSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
exports.listProductTagQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10).optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(["createdAt", "name"]).default("createdAt").optional(),
    order: zod_1.z.enum(["asc", "desc"]).default("asc").optional(),
});
