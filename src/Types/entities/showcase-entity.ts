import { userTokenPayload } from "@/Types/auth";
import { Document, Types } from "mongoose";
import {z} from "zod";

import { IGallery } from "@/core/gallery/gallery.types";
import { CreateProductDTO } from "../request/showcase-request";




export interface IProduct extends Document {
  _id:Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  originalPrice?: number;
  price: number;
  company: Types.ObjectId;
  productCategory: Types.ObjectId;
  tags: Types.ObjectId[];
  stock: number;
}



export interface IProductCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  company: Types.ObjectId;
} 

export interface IProductTag extends Document {
  name: string;
  slug: string;
  description?: string;
  company: Types.ObjectId;
}


export interface IProductWithGallery extends IProduct {
  gallery:IGallery[];
}



export type CreateProductInput = {
  data: CreateProductDTO;
  user: userTokenPayload;
}