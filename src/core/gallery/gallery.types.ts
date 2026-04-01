import { Document, Types } from "mongoose";

export enum EntityType{
    Company="Company",
    ClockMeSite = "ClockMeSite",
    User = "User",
    Product = "Product",
}

export interface MulterImageFile extends Express.Multer.File {
        fieldname: string,
        originalname: string,
        encoding: string,
        mimetype: string,
        size: number,
        bucket: string,
        key: string,
        acl: string,
        contentType: string,
        contentDisposition: string,
        contentEncoding: any|null,
        storageClass: string,
        serverSideEncryption: any|null,
        metadata: {
            fieldName: string
        },
        location:string,
        etag: string,
        File:String,
}


export type CreateGalleryInput = {
    entity_name:String,
    record_id:String,
}

export interface IGallery extends Document {
  entity_name: EntityType;
  record_id: Types.ObjectId;
  key: string;
  location: string;
  bucket?: string;
  acl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}