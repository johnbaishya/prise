import mongoose, { Schema } from "mongoose";


const productTagsSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    company_id:{
        type:Schema.Types.ObjectId,
        ref:"Company",
        required:true
    }
},{
    timestamps:true
});

const ProductTag = mongoose.models.ProductTag || mongoose.model("ProductTag", productTagsSchema);

export default ProductTag