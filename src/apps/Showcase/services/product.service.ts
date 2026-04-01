import Product from "../models/product.model";
import { CreateProductDTO } from "../schema/product.schema";
import { IProduct } from "../types/product.types";

export const createProduct = async (data: CreateProductDTO): Promise<IProduct> => {
  
  // You can add extra logic here (slug validation, stock default, etc.)
  const product = await Product.create(data);
  return product;
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findById(id);
  return product;
};

export const updateProduct = async (id: string, data: Partial<CreateProductDTO>): Promise<IProduct | null> => {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  return product;
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findByIdAndDelete(id);
  return product;
};  

export const listProducts = async (): Promise<IProduct[]> => {
  const products = await Product.find();
  return products;
};  