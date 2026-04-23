"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductsQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    originalPrice: zod_1.z.number().optional(),
    price: zod_1.z.number(),
    companyId: zod_1.z.string(),
    productCategoryId: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    stock: zod_1.z.number().optional(),
});
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
    sortBy: zod_1.z.enum(["createdAt", "price"]).default("createdAt").optional(),
    order: zod_1.z.enum(["asc", "desc"]).default("desc").optional(),
});
