import AWS,{ S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import s3Storage from "multer-s3";
import s3Config from "../config/s3Config";


const uploadImage = multer({
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

export default uploadImage;
