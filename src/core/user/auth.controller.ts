



import User from "./user.model";
import {Request, Response} from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createToken } from "../../libs/auth";
import { tokenParam } from "../../Types/auth";
import { UserRequest } from "../../Types/request";
import { UpdateUserReqBody } from "../../modules/Common/types/reqBodyTypes";
import { sendErrorResponse, sendResponseWithMessage, sendSuccessResponse } from "../../libs/reqest";
import { MulterImageFile } from "../../modules/Common/types/FileTypes";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { IUser } from "./user.types";





// for register=======================================================================================================


/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags: [Common]
 *     summary: User Register
 *     description: Register a user and return created user with token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: created user with token.
 *       500:
 *         description: some error.
 */
export const userRegister = async(req:Request, res:Response)=>{
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



// for login  ======================================================================================================
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     operationId: userLogin
 *     tags: [Common]
 *     summary: User login
 *     description: Authenticate an employee and return a session token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: user detail with token.
 *       401:
 *         description: Invalid credentials.
 */
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
       let newUser:IUser  = {
         id:user.id,
         first_name:user.first_name,
         last_name:user.last_name,
         email:user.email,
         profile_pic:user.profile_pic,
         phone:user.phone
     };
 
       // user
       res.status(200).json({user:newUser,token});
     }else{
       res.status(400).send("Invalid Credentials");
     }
   } catch (err) {
     console.log(err);
   }
   // Our register logic ends here
}


/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     operationId: update user profile
 *     tags: [Common]
 *     summary: User profile update
 *     description: update the current user profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: updated user.
 *       401:
 *         description: Invalid credentials.
 */
export const updateUser = async(req:UserRequest,res:Response)=>{
  try {
    let {first_name,last_name,phone}:UpdateUserReqBody = req.body;
    let newBody = {first_name,last_name,phone}
    let userId = req.user?.id;
    if(!userId){
      sendResponseWithMessage(res,400,"user not found");
      return;
    }
    let uUser = await User.findByIdAndUpdate(userId,newBody,{new:true})
    let userResponse:IUser = {
      id:uUser._id,
      first_name:uUser.first_name,
      last_name:uUser.last_name,
      email:uUser.email,
      profile_pic:uUser.profile_pic,
      phone:uUser.phone,
      username:uUser.username

    }
    sendSuccessResponse(res,userResponse);
  } catch (error) {
    console.log("error from update User",error);
    sendErrorResponse(res,error);
  }
}

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: user profile
 *     description: get the current user profile.
 *     responses:
 *       200:
 *         description: user.
 *       401:
 *         description: Invalid credentials.
 */
export const getUser = async(req:UserRequest,res:Response)=>{
  try {
    let userId = req.user?.id;
    if(!userId){
      sendResponseWithMessage(res,400,"user not found");
      return;
    }
    let uUser = await User.findById(userId)
    sendSuccessResponse(res,uUser);
  } catch (error) {
    console.log("error from get User",error);
    sendErrorResponse(res,error);
  }
}


/**
 * @swagger
 * /api/user/profile-pic:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: User profile picture update
 *     description: update the current user profile picture.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary # Indicates file upload in Swagger
 *     responses:
 *       200:
 *         description: updated user.
 *       401:
 *         description: Invalid credentials.
 *     
 */
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
    let uUser = await User.findByIdAndUpdate(userId,{profile_pic:image.location},{new:true})
    sendSuccessResponse(res,uUser);
  } catch (error) {
    console.log("error from changeUserProfilePicture");
    sendErrorResponse(res,error);
  }
}








// to check if the token present in the header is valid or not
/**
 * @swagger
 * /api/user/verify-token:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: user authentication status
 *     description: check if the provided bearer token is valid
 *     responses:
 *       200:
 *         description: token is valid.
 *       401:
 *         description: Invalid token.
 */
export const verifyAuthentication = (req:UserRequest,res:Response)=>{
  try {
      sendResponseWithMessage(res,200,"token is valid");
  } catch (error) {
      sendResponseWithMessage(res,401,"invalid token");
  }
}





export const googleLogin = async(req:Request,res:Response)=>{
  const client = new OAuth2Client(process.env.GOOGLE_SIGNIN_WEB_CLIENT_ID);
  const {idToken} = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_SIGNIN_WEB_CLIENT_ID, // Must match the one used in your React Native app
    });
    const payload:any = ticket.getPayload();
    const email = payload.email;
    const last_name = payload.familyName;
    const first_name = payload.name?payload.name:"user";
    const profile_pic = payload.picture;
    const oldUser = await User.findOne({ email });
    let user = null;
    if(!oldUser){
      user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        profile_pic,
      });
    }else{
      user = await User.findByIdAndUpdate(oldUser.id,{first_name,last_name,profile_pic},{new:true});
    }

    const params:tokenParam = {
      id:user.id,
      email,
      first_name:user.first_name,
      last_name:user.last_name,
      role:user.role,
    }
   
     const token  = createToken(params);
       // save user token
       user.token = token;
       let newUser:IUser = {
         id:user.id,
         first_name:user.first_name,
         last_name:user.last_name,
         email:user.email,
         profile_pic:user.profile_pic,
     };
     
     const newResponse = {
      user:newUser,
      token,
     }
 
      res.status(200).json(newResponse);
      return;
     
   } catch (err) {
     console.log(err);
     sendErrorResponse(res,err)
   }
}


export const facebookLogin = async(req:Request,res:Response)=>{
  const client = new OAuth2Client(process.env.GOOGLE_SIGNIN_WEB_CLIENT_ID);
  const {accessToken} = req.body;
  try {
    const response = await axios.get("https://graph.facebook.com/me?fields=id,name,email,first_name,last_name,picture&access_token="+accessToken);
    const payload = response.data; 
    const email = payload.email;
    const last_name = payload.last_name;
    const first_name = payload.first_name?payload.first_name:"user";
    const profile_pic = payload.picture?.data?.url;
    const facebook_id = payload.id;
    const oldUser = await User.findOne({ facebook_id });
    let user = null;
    if(!oldUser){
      user = await User.create({
        first_name,
        last_name,
        email, // sanitize: convert email to lowercase
        profile_pic,
        facebook_id,
      });
    }else{
      user = await User.findByIdAndUpdate(oldUser.id,{first_name,last_name,profile_pic,email},{new:true});
    }

    const params:tokenParam = {
      id:user.id,
      email,
      first_name:user.first_name,
      last_name:user.last_name,
      role:user.role,
    }
   
     const token  = createToken(params);
       // save user token
       user.token = token;
       let newUser  = {
         id:user.id,
         first_name:user.first_name,
         last_name:user.last_name,
         email:user.email,
         profile_pic:user.profile_pic,
         role:user.role,
     };
     
     const newResponse = {
      user:newUser,
      token,
     }
 
      res.status(200).json(newResponse);
      return;
     
   } catch (err) {
     console.log(err);
     sendErrorResponse(res,err)
   }
}
