import mongoose, { Schema } from "mongoose";


const productTagsSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    }
},{
    timestamps:true
});

const ProductTag = mongoose.models.ProductTag || mongoose.model("ProductTag", productTagsSchema);

export default ProductTag