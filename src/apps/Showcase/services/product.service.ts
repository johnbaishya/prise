import { checkCompanyOwnershipByCompanyId } from "@/core/company/company.service";
import Product from "../models/product.model";
import { CreateProductDTO } from "../schema/product.schema";
import { IProduct } from "../types/showcase.interface";


export const createProduct = async (data: CreateProductDTO,userId:string): Promise<IProduct> => {
  const companyId = data.company_id;
  const isOwner = await checkCompanyOwnershipByCompanyId(userId, companyId);
  if (!isOwner) {
    const error = new Error("You are not authorized to create a product for this company");
    (error as any).status = 403;
    throw error;
  }

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