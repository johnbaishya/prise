import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  profile_pic:{type:String,require:false},
  password: { type: String },
  token: { type: String },
});

const User = mongoose.models.User||mongoose.model("User", userSchema);
export default User;