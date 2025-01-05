



import User from "../model/User";
import {Request, Response} from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createToken } from "../../../libs/auth";
import { tokenParam } from "../../../Types/auth";
import { UserRequest } from "../../../Types/request";
import { UpdateUserReqBody } from "../types/reqBodyTypes";
import { sendErrorResponse, sendResponseWithMessage, sendSuccessResponse } from "../../../libs/reqres";
import { MulterImageFile } from "../types/FileTypes";






// for register=======================================================================================================
export const userRegister = async(req:Request, res:Response)=>{
  console.log("inside user register function");
     // Our register logic starts here
     try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;
        // Validate user input
        if (!(email && password && first_name && last_name)) {
          res.status(400).send("All input is required");
          return;
        }
    
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });
    
        if (oldUser) {
           res.status(409).send("User Already Exist. Please Login");
        }
    
        //Encrypt user password
        let encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in our database
        const user = await User.create({
          first_name,
          last_name,
          email: email.toLowerCase(), // sanitize: convert email to lowercase
          password: encryptedPassword,
        });
    
        // Create token
        const params:tokenParam = {
            id:user.id,
            email,
            first_name:user.first_name,
            last_name:user.last_name
        }

        const token  = createToken(params);
        
        // save user token
        let newUser  = {
            id:user.id,
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            token:token,
        };
    
        // return new user
        res.status(201).json(newUser);
      } catch (err) {
        console.log(err);
      }
      // Our register logic ends here
}
// register ends here ==============================================================================================


export const updateUser = async(req:UserRequest,res:Response)=>{
  try {
    let {first_name,last_name}:UpdateUserReqBody = req.body;
    let newBody = {first_name,last_name}
    let userId = req.user?.id;
    if(!userId){
      sendResponseWithMessage(res,400,"user not found");
      return;
    }
    let uUser = await User.findByIdAndUpdate(userId,newBody,{new:true})
    sendSuccessResponse(res,uUser);
  } catch (error) {
    console.log("error from update User",error);
    sendErrorResponse(res,error);
  }
}


export const ChangeUserProfilePicture = async(req:UserRequest,res:Response) =>{
  try {
    let userId = req.user?.id;
    if(!userId){
      sendResponseWithMessage(res,400,"user not found");
      return;
    }
    let file = req.file;
    if(!file){
      return;
    }
    let image = file as MulterImageFile;
    console.log("imgloc",image)
    let uUser = await User.findByIdAndUpdate(userId,{profile_pic:image.location},{new:true})
    sendSuccessResponse(res,uUser);
  } catch (error) {
    console.log("error from changeUserProfilePicture");
    sendErrorResponse(res,error);
  }
}






// for login  ======================================================================================================
export const userLogin = async(req:Request,res:Response)=>{
     // Our login logic starts here
     try {
        // Get user input
        const { email, password } = req.body;
    
        // Validate user input
        if (!(email && password)) {
          res.status(400).send("All inputs are required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });
    
        if (user && (await bcrypt.compare(password, user.password as string))) {
          // Create token
        
        const params:tokenParam = {
            id:user.id,
            email,
            first_name:user.first_name,
            last_name:user.last_name
        }

        const token  = createToken(params);
    
          // save user token
          user.token = token;
          let newUser  = {
            id:user.id,
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            token:token,
        };
    
          // user
          res.status(200).json(newUser);
        }else{
          res.status(400).send("Invalid Credentials");
        }
      } catch (err) {
        console.log(err);
      }
      // Our register logic ends here
}
