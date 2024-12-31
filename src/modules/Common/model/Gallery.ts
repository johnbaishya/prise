import mongoose, { Schema } from "mongoose";
import { EntityNameEnum } from "../types/EntityEnum";

const gallerySchema = new mongoose.Schema({
    entity_name:{
        type:String,
        enum:Object.values(EntityNameEnum),
        default:EntityNameEnum.Company,
        required:true,
    },
    record_id:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    key:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    bucket:String,
    acl:String,
})

const Gallery = mongoose.models.Gallery||mongoose.model("Gallery",gallerySchema);
export default Gallery;