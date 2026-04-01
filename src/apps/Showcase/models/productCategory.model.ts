import mongoose, { Schema } from "mongoose";


const productCategorySchema = new Schema({
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

const ProductCategory = mongoose.models.ProductCategory || mongoose.model("ProductCategory", productCategorySchema);

export default ProductCategory