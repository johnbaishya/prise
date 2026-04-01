"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    original_price: zod_1.z.number().optional(),
    price: zod_1.z.number(),
    comapany_id: zod_1.z.string(),
    product_category_id: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    stock: zod_1.z.number().optional(),
});
