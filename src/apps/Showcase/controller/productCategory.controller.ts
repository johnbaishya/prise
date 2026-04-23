import { UserRequest } from "@/Types/request";
import { Response } from "express";
import { createProductCategoryDTO } from "../schema/productCategory.schema";
import { sendResponseWithMessage, sendSuccessResponse } from "@/libs/reqest";
import ProductCategory from "../models/productCategory.model";
import * as productCategoryService from "../services/productCategory.service";







// to create a Product Category
/**
 * @swagger
 * /api/product-category:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Add Product Category
 *     description: create a new product category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *               slug: 
 *                 type: string
 *                 required: true
 *               companyId:
 *                 type: string
 *                 format: objectId
 *             required:
 *               - name
 *               - slug
 *               - companyId
 *     responses:
 *       200:
 *         description: created product category.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const createProductCategory = async(req:UserRequest,res:Response)=>{
    try {
        const data:createProductCategoryDTO = req.body;
        const productCategory = await productCategoryService.createProductCategory(data,req.user?.id!);
        sendSuccessResponse(res,productCategory)
    } catch (error: any) {
        sendResponseWithMessage(res,error.status || 500,error.message || "internal server error");
    }
}











// to update a product category by id with company ownership check
/**
 * 
 * @swagger
 * /api/product-category/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Update Product Category
 *     description: update an existing product category.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               slug:
 *                 type: string
 *             required:
 *               - name
 *               - slug
 *     responses:
 *       200:
 *         description: updated product category.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 */
export const updateProductCategory = async(req:UserRequest,res:Response)=>{
 try {
    const productCategoryId = req.params.id;
    const data:createProductCategoryDTO = req.body;
    
    const userId = req.user?.id!;
    const updatedProductCategory = await productCategoryService.updateProductCategory(productCategoryId,data,userId);
    sendSuccessResponse(res,updatedProductCategory);

 } catch (error: any) {
    sendResponseWithMessage(res,error.status,error.message);
 }
}














/**
 * 
 * @swagger
 * /api/product-category/company/{companyId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Get Product Categories by Company Id
 *     description: Get all product categories of a company by company id.
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: List of product categories.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: Company not found.
 *       500:
 *         description: something wrong
 */
export const getProductCategoriesByCompanyId = async(req:UserRequest,res:Response)=>{
    try {
        const companyId = req.params.id;
        const productCategories = await productCategoryService.getProductCategoriesByCompanyId(companyId);
        sendSuccessResponse(res,productCategories);
    } catch (error) {
        sendResponseWithMessage(res,500,"internal server error");
    }   
}













/**
 * @swagger
 * /api/product-category/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Get Product Category by Id
 *     description: Get a product category by its id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Product category found.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: Product category not found.
 *       500:
 *         description: something wrong
 */
export const getProductCategoryById = async(req:UserRequest,res:Response)=>{
    try {
        const productCategoryId = req.params.id;
        const userId = req.user?.id!;
        const productCategory = await productCategoryService.getProductCategoryById(productCategoryId);
        sendSuccessResponse(res,productCategory);
    } catch (error: any) {
        sendResponseWithMessage(res,error.status,error.message);
    }
};














/**
 * @swagger
 * /api/product-category/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Delete Product Category by Id
 *     description: Delete a product category by its id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Product category deleted successfully.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: Product category not found.
 *       500:
 *         description: something wrong
 */

export const deleteProductCategory = async(req:UserRequest,res:Response)=>{
    try {
            const productCategoryId = req.params.id;
            const userId = req.user?.id!;
            await productCategoryService.deleteProductCategory(productCategoryId,userId);
            sendResponseWithMessage(res,200,"product category deleted successfully");
        } catch (error: any) {
            sendResponseWithMessage(res,error.status,error.message);
    }
};