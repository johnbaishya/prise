import { userTokenPayload } from "@/Types/auth";
import { Document, Types } from "mongoose";
import {z} from "zod";

import { IGallery } from "@/core/gallery/gallery.types";
import { CreateProductDTO } from "../request/showcase-request";




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


const productSchema = z.object({
  _id:z.string(),
  name:z.string(),
  slug: z.string(),
  description: z.string().optional(),
  originalPrice: z.number().optional(),
  price: z.number(),
  company: z.string(),
  productCategory: z.string(),
  tags: z.array(z.string()),
  stock: z.number()
})

export type IProduct = z.infer<typeof productSchema>; 



// export interface IProductCategory extends Document {
//   name: string;
//   slug: string;
//   description?: string;
//   company: Types.ObjectId;
// } 


const productCategorySchema = z.object({
  _id:z.string(),
  name:z.string(),
  slug:z.string(),
  description:z.string(),
  company:z.string(),
  image:z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type IProductCategory = z.infer<typeof productCategorySchema>

const productTagSchema = z.object({
  _id:z.string(),
  name:z.string(),
  slug:z.string(),
  description:z.string(),
  company:z.string(),
  image:z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type IProductTag = z.infer<typeof productTagSchema>

// export interface IProductTag extends Document {
//   name: string;
//   slug: string;
//   description?: string;
//   company: Types.ObjectId;
// }


export interface IProductWithGallery extends IProduct {
  gallery:IGallery[];
}



export type CreateProductInput = {
  data: CreateProductDTO;
  user: userTokenPayload;
}