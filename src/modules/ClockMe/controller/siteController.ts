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

