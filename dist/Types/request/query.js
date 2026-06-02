"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseListQuerySchema = void 0;
const zod_1 = require("zod");
exports.baseListQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10).optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(["createdAt", "name"]).default("createdAt").optional(),
    order: zod_1.z.enum(["asc", "desc"]).default("desc").optional(),
});
