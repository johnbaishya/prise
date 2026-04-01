import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String
    },
    original_price:{
        type:Number,
    },
    price:{
        type:Number,
        required:true
    },
    company_id:{
        type:Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    product_category_id:{
        type:Schema.Types.ObjectId,
        ref:"ProductCategory",
        required:true
    },
    tags:[{ 
        type: Schema.Types.ObjectId, 
        ref: "ProductTag",
    }],
    stock:{
        type:Number,
        default:0
    },
},{
    timestamps:true
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product