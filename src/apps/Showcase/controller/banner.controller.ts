import { UserRequest } from "@/Types/request";
import { Response } from "express";
import * as bannerService from "../services/banner.service";
import { sendErrorResponse, sendSuccessResponse } from "@/libs/reqest";
import { MulterImageFile } from "@/core/gallery/gallery.types";







/**
 * @swagger
 * /api/showcase/company/{id}/banner:
 *   post:
 *     summary: Add banner images for showcase to show it in the main website as banner
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
export const addShowcaseBannerImages = async(req:UserRequest,res:Response)=>{
  try {
     const files = req.files as MulterImageFile[];
     const companyId = req.params.id;
     const userId = req.user?.id!;
     const addedImages = await bannerService.addShowcaseBannerImages(companyId,  userId, files);
     sendSuccessResponse(res, addedImages);
   } catch (error: any) {
     sendErrorResponse(res, error);
   }
 }
 



/**
 * @swagger
 * /api/showcase/company/{id}/banner:
 *   get:
 *     summary: list showcase banner images of a company
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
 *         description: List of Gallery
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
// to get the product gallery 
export const getShowcaseBannerImages = async (req:UserRequest, res:Response)=>{
  try {
    const companyId = req.params.id;
    const banners = await bannerService.getShowcaseBannerImages(companyId);
    sendSuccessResponse(res,banners)
  } catch (error) {
    sendErrorResponse(res, error);
  }
}