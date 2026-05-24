"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// export interface IProduct extends Document {
//   _id:string;
//   name: string;
//   slug: string;
//   description?: string;
//   originalPrice?: number;
//   price: number;
//   company: Types.ObjectId;
//   productCategory: Types.ObjectId;
//   tags: Types.ObjectId[];
//   stock: number;
// }
const productSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    originalPrice: zod_1.z.number().optional(),
    price: zod_1.z.number(),
    company: zod_1.z.string(),
    productCategory: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()),
    stock: zod_1.z.number()
});
// export interface IProductCategory extends Document {
//   name: string;
//   slug: string;
//   description?: string;
//   company: Types.ObjectId;
// } 
const productCategorySchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    description: zod_1.z.string(),
    company: zod_1.z.string(),
    image: zod_1.z.string().optional(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
const productTagSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    description: zod_1.z.string(),
    company: zod_1.z.string(),
    image: zod_1.z.string().optional(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
