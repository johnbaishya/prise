export type UpdateUserReqBody = {
    first_name:string,
    last_name:string,
    phone:string,
}

export type AddGalleryReqBody = {
    entityType:string,
    entityId:string,
}