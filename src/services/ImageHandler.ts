import AWS,{ S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import s3Storage from "multer-s3";
import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3"
import s3Config from "../config/s3Config";
import { IGallery } from "@/core/gallery/gallery.types";

// const s3 = new S3Client({
//     region:process.env.AWS_REGION,
//     endpoint:process.env.AWS_REGION_ENDPOINT    ,
//     credentials:{
//         accessKeyId:process.env.AWS_ACCESS_KEY_ID as string,
//         secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY as string
//     }
// });

export const uploadImage = multer({
    storage:s3Storage({
        s3:s3Config,
        bucket:process.env.AWS_S3_BUCKET_NAME as string,
        // acl:"public-read",
        contentDisposition:"inline",
        contentType:s3Storage.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString()+file.originalname)
        },
    })
});


export const deleteS3Image  = async(key:string)=>{
    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME as string, // Bucket name
            Key: key 
        }
        const deleteCommand = new DeleteObjectCommand(params);
        const response = await s3Config.send(deleteCommand);
        return response;
    } catch (error) {
        console.log("error from delete image",error);
    }
}


// for deleting multiple images from s3
// iota delete multiple images from s3 we need to pass an array of image keys to the deleteMultipleS3Images function and then we will create an array of objects with the key property and then we will pass that array to the deleteObjectsCommand of s3 client.
// it could be used in the scenario like where we want to delete all the images of a product when we delete that product from the database.
export const deleteMultipleS3Images = async(s3Images:IGallery[])=>{
    try {
        const Objects = s3Images.map(image=>{
            return {Key:image.key};
        });

        const input = {
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Delete: {
                Objects: Objects,
                Quiet: false
            }
        };
        const deleteCommand = new DeleteObjectsCommand(input);
        const response = await s3Config.send(deleteCommand);
        return response;
    } catch (error) {
        console.log("error from delete multiple images",error);     
    }
}