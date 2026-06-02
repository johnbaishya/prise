"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const companySchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    user_id: zod_1.z.string(),
    category: zod_1.z.string(),
    Currency: zod_1.z.string().optional(),
    brand_color: zod_1.z.string().optional(),
    brand_logo: zod_1.z.string().optional(),
});
