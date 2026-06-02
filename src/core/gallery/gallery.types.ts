import { Document, Types } from "mongoose";

export enum EntityType{
    Company="Company",
    ClockMeSite = "ClockMeSite",
    User = "User",
    Product = "Product",
    ShowcaseBanner = "ShowcaseBanner"
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
    entityType: String,
    entityId:String,
}

export interface IGallery extends Document {
  entityType: EntityType;
  entityId: Types.ObjectId;
  key: string;
  location: string;
  bucket?: string;
  acl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}