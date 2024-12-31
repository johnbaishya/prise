import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import s3Config from "../config/s3Config";

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