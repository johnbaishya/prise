
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