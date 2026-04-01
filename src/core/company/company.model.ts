import mongoose, { Schema } from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required:true },
  description: { type: String},
  email: { type: String},
  profile_pic:{type:String,require:false},
  address:{type:String},
  lat:{type:String},
  lon:{type:String},
  phone:{type:String},
  user_id:{type:Schema.Types.ObjectId, required:true, ref:"User"},
  category:{type:String,required:true},
  currency:{type:String,required:true,default:"USD"},
  brand_color:{type:String,default:"#000000"},
  brand_logo:{type:String},
});

const Company = mongoose.models.Company||mongoose.model("Company", companySchema);
export default Company;