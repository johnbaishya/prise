import mongoose, { Schema } from "mongoose";
import { EntityType } from "./gallery.types";

const gallerySchema = new mongoose.Schema({
    entityType:{
        type:String,
        enum:Object.values(EntityType),
        default:EntityType.Company,
        required:true,
    },
    entityId:{
        type:Schema.Types.ObjectId,
        required:true,
        refPath: "entityType"
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