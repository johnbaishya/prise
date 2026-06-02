import { z } from "zod"


const companySchema = z.object({
    _id:z.string(),
    name:z.string(),
    description:z.string().optional(),
    user_id:z.string(),
    category:z.string(),
    Currency:z.string().optional(),
    brand_color:z.string().optional(),
    brand_logo:z.string().optional(),
})

export type ICompany = z.infer<typeof companySchema>
