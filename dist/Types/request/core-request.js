"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompanySchema = void 0;
const zod_1 = require("zod");
exports.createCompanySchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    companyId: zod_1.z.string(),
    category: zod_1.z.string(),
    Currency: zod_1.z.string().optional(),
    brand_color: zod_1.z.string().optional(),
});
