import { EntityType, IGallery, MulterImageFile } from "./gallery.types"
import Gallery from "./gallery.model";
import { deleteMultipleS3Images, deleteS3Image } from "@/core/gallery/ImageHandler";
import { verifyProductOwnership } from "@/apps/Showcase/services/product.service";
import { verifyCompanyOwnershipByCompanyId } from "../company/company.service";
import AppError from "@/libs/errorHandler";
import { th } from "zod/v4/locales";



export const addGalleryImages = async (entity:EntityType,entityId:string, files:MulterImageFile[]):Promise<IGallery[]>=>{
    try {
        if(!files){
               files=[];
           }
           // checking if files are in other format rather than array.
           if(!Array.isArray(files)){
               files = [];
           }
   
           let galleriesBody = files.map((item)=>{
               return{
                   entityType:entity,
                   entityId:entityId,
                   key:item.key,
                   location:item.location,
                   bucket:item.bucket,
                   acl:item.acl
               }
           })
   
           let gallery = await Gallery.create(galleriesBody);
           return gallery;
    } catch (error) {
        console.log("error from add gallery image",error);
        throw error;
    }
}



export const getGalleryImages = async (entity:EntityType,entityId:string):Promise<IGallery[]>=>{
    try {
        let galleries = await Gallery.find({entityType:entity,entityId:entityId});
        return galleries;
    } catch (error) {
        console.log("error from get gallery images",error);
        throw error;
    }
}










// function to delete gallery image after checking if the user is eligible to delete the image.
export const deleteGalleryImageAfterUserVerification = async (galleryId:string,userId:string):Promise<boolean>=>{
    try {
        let gallery = await Gallery.findById(galleryId);
        if(!gallery){
            throw new AppError("Gallery image not found", 404);
        }
        let key = gallery?.key;
        const entityId = gallery?.entityId.toString();

        // check if user is the authorized to delete the image by checking the ownership of the product or company or whatever entity the gallery image is associated with. we can do this by checking the entity type and then checking the ownership of that entity. for example if the entity type is product then we will check the ownership of the product by checking the product's company and then checking the ownership of that company. if the entity type is company then we will check the ownership of the company directly. if the entity type is something else then we will throw an error saying that we don't support this entity type for gallery images.

        switch (gallery.entityType) {
            case EntityType.Product:
                await verifyProductOwnership(entityId,userId);
                break;
            case EntityType.Company:
                await verifyCompanyOwnershipByCompanyId(userId,entityId);
                break;
            default:
                throw new Error("We don't support this entity type for gallery images");
        }

        // first delete the image from s3 then delete the gallery document from database
        await deleteS3Image(key)
        await Gallery.findByIdAndDelete(galleryId);
        return true;
    } catch (error) {
        throw new AppError((error as Error).message, (error as any).status || 500);
    }
};










// delete gallery image by gallery id without user verification. this function will be used in the scenario where we want to delete all the images of a product when we delete that product from the database. in that case we don't need to check the ownership of the product because if we are deleting the product then we can assume that we have the ownership of that product.
export const deleteGalleryImage = async (galleryId:string):Promise<boolean>=>{
    try {
        let gallery = await Gallery.findById(galleryId);
        if(!gallery){
            throw new AppError("Gallery image not found", 404);
        }
        let key = gallery?.key;
        // first delete the image from s3 then delete the gallery document from database
        await deleteS3Image(key)
        await Gallery.findByIdAndDelete(galleryId);
        return true;
    } catch (error) {
        throw new AppError((error as Error).message, (error as any).status || 500);
    }
};








    // function to delete multiple gallery images by passing an array of gallery ids and then we will delete the images from s3 and then we will delete the gallery documents from database.
export const deleteMultipleGalleryImages = async (galleryIds:string[]):Promise<void>=>{
    try {
        
    } catch (error) {
        
    }
}




// function to delete multiple gallery images by entity id without user verification. this function will be used in the scenario where we want to delete all the images of a product when we delete that product from the database. in that case we don't need to check the ownership of the product because if we are deleting the product then we can assume that we have the ownership of that product.
export const deleteMultipleGalleryImagesByEntityId = async (entity:EntityType,entityId:string):Promise<void>=>{
    try {
        let galleries = await Gallery.find({entityType:entity,entityId:entityId});
        let keys = galleries.map(gallery=>gallery.key);
        await deleteMultipleS3Images(keys);
        await Gallery.deleteMany({entityType:entity,entityId:entityId});
    } catch (error) {
        throw new AppError((error as Error).message, (error as any).status || 500);
    }
}




export const getEachGalleryImage = async (galleryId:string):Promise<IGallery|null>=>{
    try {
        let gallery = await Gallery.findById(galleryId);
        return gallery;
    } catch (error) {
        console.log("error from get each gallery image",error);
        throw error;
    }   
};