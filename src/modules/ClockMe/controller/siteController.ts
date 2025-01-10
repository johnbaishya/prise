import { Request, Response } from "express";
import { UserRequest } from "../../../Types/request";
import ClockMeSite from "../models/ClockMeSite";
import { checkOwnership } from "../../../libs/auth";
import Company from "../../Common/model/Company";
import { sendErrorResponse, sendResponseWithMessage, sendSuccessResponse } from "../../../libs/reqres";
import { MulterImageFile } from "../../Common/types/FileTypes";
import { EntityNameEnum } from "../../Common/types/EntityEnum";
import Gallery from "../../Common/model/Gallery";
import { deleteS3Image } from "../../../services/ImageHandler";


//  to add a site
/**
 * @swagger
 * /api/clockme/site:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Add Site
 *     description: create a new site.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_id:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               lat:
 *                 type: string
 *               lon: 
 *                 type: string
 *             required:
 *               - address
 *     responses:
 *       200:
 *         description: created Site.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const addSite = async(req:UserRequest,res:Response)=>{
    try {
        let user = req.user!;
        let reqBody = req.body;
        // let site:typeof ClockMeSite = await ClockMeSite.create({user_id:user.id,address,lat,lon})
        if(reqBody.company_id){
            let companyId = reqBody.company_id;
            let company = await Company.findById(companyId)
            if(company){
                let isOwner  = checkOwnership(req,res,company);
                if(!isOwner){
                    return;
                }

            }else{
                res.status(400).json({message:"company not found"});
                return;
            }
        }
        let site = new ClockMeSite({user_id:user.id,...reqBody})
        let newSite = await site.save()

        res.status(201).json(newSite);
    } catch (error) {
        console.log("error",error)
        res.status(500).send(error);
    }
}



// to update the site
/**
 * @swagger
 * /api/clockme/site/:id:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Update Site
 *     description: update the site.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_id:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               lat:
 *                 type: string
 *               lon: 
 *                 type: string
 *     responses:
 *       200:
 *         description: updated Site.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const updateSite = async(req:UserRequest,res:Response)=>{
    try{
        // let user = req.user;
        let siteId = req.params.id;
        let site = await ClockMeSite.findById(siteId)
        if(site){
            let isOwner = checkOwnership(req,res,site)
            if(!isOwner){
                return;
            }
            // let newSite = await site.updateOne(req.body)
            let newSite = await ClockMeSite.findByIdAndUpdate(siteId,req.body,{new:true});
            res.status(201).json(newSite);
        }else{
            res.status(400).json({message:"site not found"})
        }
        
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

// to delete the site
/**
 * @swagger
 * /api/clockme/site/:id:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Delete Site
 *     description: delete the site.
 *     responses:
 *       200:
 *         description: created Site.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const deleteSite = async(req:UserRequest,res:Response)=>{
    try{
        // let user = req.user;
        let siteId = req.params.id;
        let site = await ClockMeSite.findById(siteId)
        if(site){
            let isOwner = checkOwnership(req,res,site)
            if(!isOwner){
                return;
            }
            await ClockMeSite.findByIdAndDelete(siteId,req.body);
            res.status(201).json({message:"site deleted"});
        }else{
            res.status(400).json({message:"site not found"})
        }
        
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}



// to get the user's sites
/**
 * @swagger
 * /api/clockme/site:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Get user Sites
 *     description: to get all the sites created by current user.
 *     responses:
 *       200:
 *         description: site[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const getMySites = async(req:UserRequest,res:Response)=>{
    try {
        let user_id = req.user?.id
        let sites = await ClockMeSite.find({user_id:user_id})
        // only sites created by current user is shown
        res.status(200).json(sites);
    } catch (error) {
        console.log("error from getMySite", error)
        res.status(500).send(error);
    }
}


// to get the detail of a site
/**
 * @swagger
 * /api/clockme/site/:id:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Get Site Detail
 *     description: to get the details of a site.
 *     responses:
 *       200:
 *         description: site.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const getSiteDetail = async(req:UserRequest,res:Response)=>{
    try {
        let siteId = req.params.id
        let site = await ClockMeSite.findById(siteId);
        if(site){
            res.status(200).json(site)
        }else{
            res.status(400).json({message:"Site not found"})
        }
    } catch (error) {
        console.log("error from getSiteDetail", error)
        res.status(500).send(error);
    }
}


// to get all the sites of a certain Company
/**
 * @swagger
 * /api/clockme/company/:id/site:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Get Sites by Company
 *     description: to get all the sites of a certain company.
 *     responses:
 *       200:
 *         description: site[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const getsitesByCompanyId = async(req:UserRequest,res:Response)=>{
    try {
        let companyId = req.params.id;
        let company = await Company.findById(companyId);
        if(company){
            let isOwner  = checkOwnership(req,res,company);
            if(!isOwner){
                return;
            }
        }else{
            res.status(400).json({message:"company not found"});
            return;
        }
        let sites = await ClockMeSite.find({company_id:companyId})
        res.status(200).json(sites);
    } catch (error) {
        console.log("error from getSitesByCompanyId", error)
        res.status(500).send(error);
    }
}



// function to add gallery images of a site
/**
 * @swagger
 * /api/clockme/site/:id/gallery:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: add site Gallery
 *     description: Add images to gallery of site.
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
export const addSiteGallery = async(req:UserRequest,res:Response)=>{
    try {
        let siteId = req.params.id
        let site = await ClockMeSite.findById(siteId);

        // checking if company exists
        if(!site){
            sendResponseWithMessage(res,400,"site not found");
            return
        }

        // checking if the current user owns the company
        let isOwner = checkOwnership(req,res,site);
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
                entity_name:EntityNameEnum.ClockMeSite,
                record_id:siteId,
                key:item.key,
                location:item.location,
                bucket:item.bucket,
                acl:item.acl
            }
        })

        let gallery = await Gallery.create(galleriesBody);
        sendSuccessResponse(res,gallery);

    } catch (error) {
        console.log("error from addSiteGallery",error);
        sendErrorResponse(res,error);
    }
}



//  to delete the site gallery
/**
 * @swagger
 * /api/clockme/site/gallery/:id:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: delete site gallery 
 *     description: delete an image from the site's gallery
 *     responses:
 *       200:
 *         description: image deleted successfully.
 *       401:
 *         description: unauthorized.
 *       500:
 *         description: something wrong
 *     
 */
export const deleteSiteGalleryImage = async(req:UserRequest,res:Response)=>{
    try {
        let imageKey = req.params.id;
        let gallery = await Gallery.findOne({key:imageKey})
        // checkimng if gallery image exist
        if(!gallery){
            sendResponseWithMessage(res,400,"image does not exist")
            return;
        }
        let siteId = gallery. record_id;
        let galleryid = gallery.id;
        let site = await ClockMeSite.findById(siteId);

        // checking if  company exist
        if(!site){
            sendResponseWithMessage(res,400,"site not found");
            return;
        }

        // checkking if the user has created thhis image
        const isowner = checkOwnership(req,res,site);
        if(!isowner){
            return;
        }
        await deleteS3Image(imageKey)
        await Gallery.findByIdAndDelete(galleryid);
        sendSuccessResponse(res,{message:"image deleted successfully"})
    }catch(error){
        console.log("error from deleteSiteGallery",error);
        sendErrorResponse(res,error);
    }
}


// to get the gallery of site
/**
 * @swagger
 * /api/clockme/site/:id/gallery:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: get Site's gallery
 *     description: get all the images of site's gallery.
 *     responses:
 *       200:
 *         description: gallery[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const getSiteGallery = async(req:UserRequest,res:Response)=>{
    try {
        let siteId = req.params.id;
        let site = await ClockMeSite.findById(siteId);
        if(!site){
            sendResponseWithMessage(res,400,"site not found");
            return;
        }
        let isOwner = checkOwnership(req,res,site);
        if(!isOwner){
            return;
        }
        let gallery = await Gallery.find({entity_name:EntityNameEnum.ClockMeSite,record_id:siteId})
        sendSuccessResponse(res,gallery);
    } catch (error) {
        console.log("error from getSiteGallery",error);
        sendErrorResponse(res,error);
    }
}

