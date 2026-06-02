import { z } from "zod";


export const createCompanySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  companyId: z.string(),
  category: z.string(),
  Currency:z.string().optional(),
  brand_color:z.string().optional(),
});


export type CreateCompanyDTO = z.infer<typeof createCompanySchema>;
