import { Request, Response } from "express";
import * as productService from "@/apps/Showcase/services/product.service";
import { UserRequest } from "@/Types/request";
import Company from "@/core/company/company.model";
import { checkOwnership } from "@/libs/auth";
import { CreateProductDTO } from "../schema/product.schema";



export const createProduct = async (req: UserRequest, res: Response) => {
  try {
    const data: CreateProductDTO = req.body;
    const companyId = data.comapany_id;

    const company = await Company.findById(companyId);
    const isOwner = checkOwnership(req,res,company)

    if (!isOwner) {
      return; // checkOwnership will handle the response if the user is not the owner
    }

    const product = await productService.createProduct(data);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
