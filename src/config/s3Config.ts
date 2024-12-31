import { S3Client } from "@aws-sdk/client-s3";

const s3Config = new S3Client({
    region:process.env.AWS_REGION,
    endpoint:process.env.AWS_REGION_ENDPOINT    ,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY as string
    }
});

export default s3Config;
