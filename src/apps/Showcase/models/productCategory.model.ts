import mongoose, { Schema } from "mongoose";


const productCategorySchema = new Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    company:{
        type:Schema.Types.ObjectId,
        ref:"Company",
        required:true
    }
},{
    timestamps:true
});

const ProductCategory = mongoose.models.ProductCategory || mongoose.model("ProductCategory", productCategorySchema);

export default ProductCategory