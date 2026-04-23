"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductTagSchema = exports.createProductTagSchema = void 0;
const zod_1 = require("zod");
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
