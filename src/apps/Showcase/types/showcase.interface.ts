import { userTokenPayload } from "@/Types/auth";
import { Document, Types } from "mongoose";
import {z} from "zod";
import { CreateProductDTO } from "../schema/product.schema";




export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  original_price?: number;
  price: number;
  company_id: Types.ObjectId;
  product_category_id: Types.ObjectId;
  tags: Types.ObjectId[];
  stock: number;
}



export interface IProductCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  company_id: Types.ObjectId;
} 

export interface IProductTag extends Document {
  name: string;
  slug: string;
  description?: string;
  company_id: Types.ObjectId;
}



export type CreateProductInput = {
  data: CreateProductDTO;
  user: userTokenPayload;
}