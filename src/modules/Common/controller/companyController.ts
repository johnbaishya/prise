import { Response } from "express";
import { UserRequest } from "../../../Types/request";
import Company from "../model/Company";
import { checkOwnership } from "../../../libs/auth";
import { sendErrorResponse, sendResponseWithMessage, sendSuccessResponse } from "../../../libs/reqres";
import { AddGalleryReqBody } from "../types/reqBodyTypes";
import { EntityNameEnum } from "../types/EntityEnum";
import { MulterImageFile } from "../types/FileTypes";
import Gallery from "../model/Gallery";
import { deleteS3Image } from "../../../services/ImageHandler";


// to create a company
/**
 * @swagger
 * /api/company:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: Add Company
 *     description: create a new company.
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
 *               email: 
 *                 type: string
 *               address:
 *                 type: string
 *               lat:
 *                 type: string
 *               lon: 
 *                 type: string
 *               phone:
 *                 type: string
 *               category:
 *                 type: string
 *             required:
 *               - name
 *               - category
 *     responses:
 *       200:
 *         description: created company.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const addCompany = async(req:UserRequest, res:Response)=>{
    let userId = req.user?.id;
    try {
        let company = await Company.create({user_id:userId,...req.body});
        res.status(201).json(company)
    } catch (error) {
        console.log("error from add company",error);
        res.status(500).send(error)
    }
}

// to edit a company 
/**
 * @swagger
 * /api/company/:id:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: update Company
 *     description: update a company.
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
 *               email: 
 *                 type: string
 *               address:
 *                 type: string
 *               lat:
 *                 type: string
 *               lon: 
 *                 type: string
 *               phone:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: updated company.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const updateCompany  = async(req:UserRequest,res:Response)=>{
    try{
        let companyId = req.params.id;
        let company = await Company.findById(companyId)
        if(company){
            let isOwner = checkOwnership(req,res,company)
            if(!isOwner){
                return;
            }
            let newCompany = await Company.findByIdAndUpdate(companyId,req.body,{new:true});
            res.status(200).json(newCompany);
        }else{
            res.status(400).json({message:"company not found"})
        }
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

// to delete a company 
// to edit a company 
/**
 * @swagger
 * /api/company/:id:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: delete Company
 *     description: remove a company.
 *     responses:
 *       200:
 *         description: company deleted successsfully.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const deleteCompany  = async(req:UserRequest,res:Response)=>{
    try{
        let companyId = req.params.id;
        let company = await Company.findById(companyId)
        if(company){
            let isOwner = checkOwnership(req,res,company)
            if(!isOwner){
                return;
            }
            await Company.findByIdAndDelete(companyId);
            res.status(200).json({messagwe:"Company deleted Successfully"});
        }else{
            res.status(400).json({message:"Company not found"})
        }
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

// to list the sites created by user
// to edit a company 
/**
 * @swagger
 * /api/company:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: list Company
 *     description: list all the companies created by user.
 *     responses:
 *       200:
 *         description: company[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const listMyCompanies = async(req:UserRequest,res:Response)=>{
    try {
        let userId = req.user?.id;
        let companies  = await Company.find({user_id:userId});
        res.status(200).json(companies);
    } catch (error) {
        console.log("error from listMyCompanies",error);
        res.status(500).send(error)
    }
}



// to get the detail of a certain company
// to edit a company 
/**
 * @swagger
 * /api/company/:id:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: get Company detail
 *     description: get the description of the company.
 *     responses:
 *       200:
 *         description: company.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const getCompanyDetail = async(req:UserRequest,res:Response)=>{
    try {
        let companyId = req.params.id;
        let company = await Company.findById(companyId);
        if(company){
            res.status(200).json(company);
        }else{
            res.status(400).json({message:"Company not found"});
        }
    } catch (error) {
        console.log("error from getCompanyDetail",error);
        res.status(500).send(error)
    }
}


// function to add gallery images to a Company
// to edit a company 
/**
 * @swagger
 * /api/company/:id/gallery:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: add Company Gallery
 *     description: Add images to gallery of company.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: gallery[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
const addCompanyGallery = async(req:UserRequest,res:Response)=>{
    try {
        let companyId = req.params.id
        let company = await Company.findById(companyId);

        // checking if company exists
        if(!company){
            sendResponseWithMessage(res,400,"Company not found");
            return
        }

        // checking if the current user owns the company
        let isOwner = checkOwnership(req,res,company);
        if(!isOwner){
            return;
        }

        // let body:AddGalleryReqBody = req.body;
        let files = req.files as MulterImageFile[];
        // checking if there are no any files;
        if(!files){
            files=[];;
            sendSuccessResponse(res,[]);
            return;
        }
        // checking if files are in other format rather than array.
        if(!Array.isArray(files)){
            files = [];
            sendSuccessResponse(res,[]);
            return;
        }

        let galleriesBody = files.map((item)=>{
            return{
                entity_name:EntityNameEnum.Company,
                record_id:companyId,
                key:item.key,
                location:item.location,
                bucket:item.bucket,
                acl:item.acl
            }
        })

        let gallery = await Gallery.create(galleriesBody);
        sendSuccessResponse(res,gallery);

    } catch (error) {
        console.log("error from addCompanyGallery",error);
        sendErrorResponse(res,error);
    }
}


//  to delete the company gallery
/**
 * @swagger
 * /api/company/gallery/:id:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: delete Company gallery 
 *     description: delete an image from the company gallery
 *     responses:
 *       200:
 *         description: image deleted successfully.
 *       401:
 *         description: unauthorized.
 *       500:
 *         description: something wrong
 *     
 */
const deleteCompanyGalleryImage = async(req:UserRequest,res:Response)=>{
    try {
        let imageKey = req.params.id;
        let gallery = await Gallery.findOne({key:imageKey})
        // checkimng if gallery image exist
        if(!gallery){
            sendResponseWithMessage(res,400,"image does not exist")
            return;
        }
        let companyId = gallery. record_id;
        let galleryid = gallery.id;
        let company = await Company.findById(companyId);

        // checking if  company exist
        if(!company){
            sendResponseWithMessage(res,400,"company not found");
            return;
        }

        // checkking if the user has created thhis image
        const isowner = checkOwnership(req,res,company);
        if(!isowner){
            return;
        }
        await deleteS3Image(imageKey)
        await Gallery.findByIdAndDelete(galleryid);
        sendSuccessResponse(res,{message:"image deleted successfully"})
    }catch(error){
        console.log("error from deleteCompanyGallery",error);
        sendErrorResponse(res,error);
    }
}



// to get the gallery of company
/**
 * @swagger
 * /api/company/:id/gallery:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: get Company gallery
 *     description: get all the images of company's gallery.
 *     responses:
 *       200:
 *         description: gallery[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
const getCompanyGallery = async(req:UserRequest,res:Response)=>{
    try {
        let companyId = req.params.id;
        let company = await Company.findById(companyId);
        if(!company){
            sendResponseWithMessage(res,400,"company not found");
            return;
        }
        let isOwner = checkOwnership(req,res,company);
        if(!isOwner){
            return;
        }
        let gallery = await Gallery.find({entity_name:EntityNameEnum.Company,record_id:companyId})
        sendSuccessResponse(res,gallery);
    } catch (error) {
        console.log("error from getCompanyGaller",error);
        sendErrorResponse(res,error);
    }
}


// to change the profile picture of a company
/**
 * @swagger
 * /api/company/:id/profile-pic:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: Company profile picture update
 *     description: update the Company's profile picture.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary # Indicates file upload in Swagger
 *     responses:
 *       200:
 *         description: updated user.
 *       401:
 *         description: Invalid credentials.
 *     
 */
const ChangeCompanyProfilePicture = async(req:UserRequest,res:Response) =>{
    try {
      let userId = req.user?.id;
      let companyId = req.params.id;
      if(!userId){
        sendResponseWithMessage(res,400,"user not found");
        return;
      }
      let company = await Company.findById(companyId);
      if(!company){
        sendResponseWithMessage(res,400,"company not found");
        return;
      }

      let isowner = checkOwnership(req,res,company);
      if(!isowner){
        return;
      }
      let file = req.file;
      if(!file){
        return;
      }
      let image = file as MulterImageFile;
      let uCompany = await Company.findByIdAndUpdate(companyId,{profile_pic:image.location},{new:true})
      sendSuccessResponse(res,uCompany);
    } catch (error) {
      console.log("error from changeCompanyProfilePicture");
      sendErrorResponse(res,error);
    }
  }

const companyController = {addCompany, deleteCompany, updateCompany,listMyCompanies,getCompanyDetail,addCompanyGallery,deleteCompanyGalleryImage,getCompanyGallery,ChangeCompanyProfilePicture};
export default companyController;

