import { Request, Response } from "express";
import * as productService from "@/apps/Showcase/services/product.service";
import { UserRequest } from "@/Types/request";
import Company from "@/core/company/company.model";
import { checkOwnership } from "@/libs/auth";
import { CreateProductDTO } from "../schema/product.schema";
import { sendResponseWithMessage, sendSuccessResponse } from "@/libs/reqres";



export const createProduct = async (req: UserRequest, res: Response) => {
  try {
    const data: CreateProductDTO = req.body;
    const userId = req.user?.id!;
    const product = await productService.createProduct(data, userId);
    sendSuccessResponse(res, product);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
