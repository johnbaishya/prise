import { UserRequest } from "@/Types/request";
import { Response } from "express";
import { createProductTagDTO } from "../schema/productTag.schema";
import { sendResponseWithMessage, sendSuccessResponse } from "@/libs/reqest";
import * as productTagService from "../services/productTag.service";
import { ListProductTagQueryDTO } from "@/Types/request/showcase-request";
import { MulterImageFile } from "@/core/gallery/gallery.types";

// to create a Product Tag
/**
 * @swagger
 * /api/product-tag:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Add Product Tag
 *     description: create a new product tag.
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
 *               company_id:
 *                 type: string
 *                 format: objectId
 *             required:
 *               - name
 *               - slug
 *               - company_id
 *     responses:
 *       200:
 *         description: created product tag.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 */
export const createProductTag = async(req: UserRequest, res: Response) => {
    try {
        const data: createProductTagDTO = req.body;
        const file = req.file as MulterImageFile;
        const productTag = await productTagService.createProductTag(data, req.user?.id!,file);
        sendSuccessResponse(res, productTag);
    } catch (error: any) {
        sendResponseWithMessage(res, error.status || 500, error._message || "internal server error");
        // sendResponseWithMessage(res, error.status || 500, error.message || "internal server error");
        throw error;
    }
}

// to update a product tag by id with company ownership check
/**
 * 
 * @swagger
 * /api/product-tag/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Update Product Tag
 *     description: update an existing product tag.
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
 *         description: updated product tag.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 */
export const updateProductTag = async(req: UserRequest, res: Response) => {
    try {
        const productTagId = req.params.id;
        const data: createProductTagDTO = req.body;
        const file = req.file as MulterImageFile;
        const userId = req.user?.id!;
        const updatedProductTag = await productTagService.updateProductTag(productTagId, data, userId,file);
        sendSuccessResponse(res, updatedProductTag);
    } catch (error: any) {
        sendResponseWithMessage(res, error.status, error.message);
    }
}

/**
 * 
 * @swagger
 * /api/product-tag/company/{companyId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Get Product Tags by Company Id
 *     description: Get all product tags of a company by company id.
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: List of product tags.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: Company not found.
 *       500:
 *         description: something wrong
 */
export const getProductTagsByCompanyId = async(req: UserRequest, res: Response) => {
    try {
        const companyId = req.params.id;
        const query:ListProductTagQueryDTO = req.query
        const productTags = await productTagService.getProductTagsByCompanyId(companyId,query);
        sendSuccessResponse(res, productTags);
    } catch (error) {
        sendResponseWithMessage(res, 500, "internal server error");
    }   
}

/**
 * @swagger
 * /api/product-tag/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Get Product Tag by Id
 *     description: Get a product tag by its id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Product tag found.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: Product tag not found.
 *       500:
 *         description: something wrong
 */
export const getProductTagById = async(req: UserRequest, res: Response) => {
    try {
        const productTagId = req.params.id;
        const userId = req.user?.id!;
        const productTag = await productTagService.getProductTagById(productTagId);
        sendSuccessResponse(res, productTag);
    } catch (error: any) {
        sendResponseWithMessage(res, error.status, error.message);
    }
};

/**
 * @swagger
 * /api/product-tag/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Delete Product Tag by Id
 *     description: Delete a product tag by its id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Product tag deleted successfully.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: Product tag not found.
 *       500:
 *         description: something wrong
 */
export const deleteProductTag = async(req: UserRequest, res: Response) => {
    try {
        const productTagId = req.params.id;
        const userId = req.user?.id!;
        await productTagService.deleteProductTag(productTagId, userId);
        sendResponseWithMessage(res, 200, "product tag deleted successfully");
    } catch (error: any) {
        sendResponseWithMessage(res, error.status, error.message);
    }
};
