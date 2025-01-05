import AWS,{ S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import s3Storage from "multer-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import s3Config from "../config/s3Config";

console.log("region",process.env.AWS_REGION)
console.log("bucket",process.env.AWS_S3_BUCKET_NAME)
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
            console.log("here",file)
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