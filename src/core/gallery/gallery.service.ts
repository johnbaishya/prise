import { EntityType, IGallery, MulterImageFile } from "./gallery.types"
import Gallery from "./gallery.model";
import { deleteS3Image } from "@/services/ImageHandler";



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
                   entity_name:entity,
                   record_id:entityId,
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
        let galleries = await Gallery.find({entity_name:entity,record_id:entityId});
        return galleries;
    } catch (error) {
        console.log("error from get gallery images",error);
        throw error;
    }
}



export const deleteGalleryImage = async (galleryId:string):Promise<boolean>=>{
    try {
        let gallery = await Gallery.findById(galleryId);
        if(!gallery){
            throw new Error("Gallery image not found");
        }
        let key = gallery?.key;
        // first delete the image from s3 then delete the gallery document from database
        await deleteS3Image(key)
        await Gallery.findByIdAndDelete(galleryId);
        return true;
    } catch (error) {
        console.log("error from delete gallery image",error);
        throw error;
    }
};




export const getEachGalleryImage = async (galleryId:string):Promise<IGallery|null>=>{
    try {
        let gallery = await Gallery.findById(galleryId);
        return gallery;
    } catch (error) {
        console.log("error from get each gallery image",error);
        throw error;
    }   
};