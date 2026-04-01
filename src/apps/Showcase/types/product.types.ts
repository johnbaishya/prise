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
  comapany_id: Types.ObjectId;
  product_category_id: Types.ObjectId;
  tags: Types.ObjectId[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}



export type CreateProductInput = {
  data: CreateProductDTO;
  user: userTokenPayload;
}