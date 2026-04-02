"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductCategorySchema = void 0;
const zod_1 = require("zod");
exports.createProductCategorySchema = zod_1.z.object({
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    company_id: zod_1.z.string(),
});
