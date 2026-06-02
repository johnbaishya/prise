import {z} from "zod";

export const baseListQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(100).default(10).optional(),
    search: z.string().optional(),
    sortBy: z.enum(["createdAt", "name"]).default("createdAt").optional(),
    order: z.enum(["asc", "desc"]).default("desc").optional(),
});


export type BaseListQueryDTO = z.infer<typeof baseListQuerySchema>