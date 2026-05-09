import { Request, Response } from "express";
import * as productService from "@/apps/Showcase/services/product.service";
import { UserRequest } from "@/Types/request";
import Company from "@/core/company/company.model";
import { checkOwnership } from "@/libs/auth";
import { CreateProductDTO, ListProductsQueryDTO, UpdateProductDTO } from "@/Types/request/showcase-request";
import { sendErrorResponse, sendResponseWithMessage, sendSuccessResponse } from "@/libs/reqest";
import { MulterImageFile } from "@/core/gallery/gallery.types";
import { IProductWithGallery } from "../../../Types/entities/showcase-entity";
import { send } from "process";


// function to create a product with ownership check
/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Showcase]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               originalPrice:
 *                 type: number
 *               price:
 *                 type: number
 *               company:
 *                 type: string
 *               productCategory:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
export const createProduct = async (req: UserRequest, res: Response) => {
  try {
    const data: CreateProductDTO = req.body;
    const userId = req.user?.id!;
    // acess the images if any
    const images= req.files as MulterImageFile[];
    const product:IProductWithGallery = await productService.createProduct(data, userId, images)
    sendSuccessResponse(res, product);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};















/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Showcase]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               originalPrice:
 *                 type: number
 *               price:
 *                 type: number
 *               productCategory:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
// to update a product with ownership and eligibility checks
export const updateProduct = async (req: UserRequest, res: Response) => {
  try {
    const productId = req.params.id;
    const data: UpdateProductDTO = req.body;
    const userId = req.user?.id!;
    const updatedProduct:IProductWithGallery = await productService.updateProduct(productId, data, userId);
    sendSuccessResponse(res, updatedProduct);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

















/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Showcase]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
// to delete a product with ownership check
export  const deleteProduct = async (req: UserRequest, res: Response) => {
  try {
    const productId = req.params.id;
    const userId = req.user?.id!;
    await productService.deleteProduct(productId, userId);
    sendSuccessResponse(res, { message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
}












/**
 * @swagger
 * /api/product/{id}/gallery:
 *   post:
 *     summary: Add gallery images to a product
 *     tags: [Showcase]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Gallery images added successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
// to add the product gallery with ownership check
export const addProductGallery = async (req: UserRequest, res: Response) => {
  try {
    const files = req.files as MulterImageFile[];
    const productId = req.params.id;
    const userId = req.user?.id!;
    const addedImages = await productService.addProductGalleryImages(productId,  userId, files);
    sendSuccessResponse(res, addedImages);
  } catch (error: any) {
    sendErrorResponse(res, error);
  }
}














// 

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get product details by ID
 *     tags: [Showcase]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product detail retrieved successfully
 *       404:
 *         description: Product not found
 */
// to get the product detail with gallery by product id
export const getProductDetail = async (req: UserRequest, res: Response) => {
  try {
    const productId = req.params.id;
    const productDetail:IProductWithGallery = await productService.getProductById(productId);
    sendSuccessResponse(res, productDetail);
  } catch (error) {
    sendErrorResponse(res, error);
  }
}










/**
 * @swagger
 * /api/product/company/{id}:
 *   get:
 *     summary: List products for a company
 *     tags: [Showcase]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search term for filtering products
 *     responses:
 *       200:
 *         description: Company products retrieved successfully
 *       404:
 *         description: Company not found
 */
export const getProductsbyCompanyId = async(req:UserRequest,res:Response)=>{
  try {
    const companyId = req.params.id;
    const query:ListProductsQueryDTO = req.query
    const result = await productService.listProducts(companyId,query);
    sendSuccessResponse(res,result);
  } catch (error) {
    sendErrorResponse(res,error);
  }
}
