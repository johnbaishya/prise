import { Document, Error, Model, Models, Schema } from "mongoose";
import { tokenParam, userTokenPayload } from "../Types/auth";
import  jwt from "jsonwebtoken";
import { UserRequest } from "../Types/request";
import { Response } from "express";
import { error } from "console";
import { ca } from "zod/v4/locales";
import Company from "@/core/company/company.model";

export const createToken = ({id,email,first_name,last_name}:tokenParam):string=>{
    const token:string = jwt.sign(
        {id, email,first_name,last_name },
        process.env.TOKEN_KEY as string,
    );

    return token;
} 



// ===========================================================================================================================
// function to check ownership by comparing user id from token with user id in the document
export const checkOwnership = (req:UserRequest,res:Response,doc:Document):boolean=>{
        let userId = req.user?.id!;
        let userIdInDocument = doc.get("user_id");
        let isowner  = userId.toString() === userIdInDocument.toString()
        if (!isowner) {
            res.status(403).json({message:"you are not authorized for this action"})
            return false
        }
        return true;
        
}


// =--==========================================================================================================================
// function to check company ownership by company id
// it will be used in the controllers and services to check if the user is the owner of the company before allowing them to perform certain actions (like creating a product, etc.)
export const checkComanyOwnershipByCompanyId = async (userId:string,companyId:string):Promise<boolean>=>{
    let company = await Company.findById(companyId);
    let isOwner  = checkOwnershipStatus(userId,company);
    return isOwner;
}




// =============================================================================================================================
// function to check ownership status by comparing user id from token with user id in the document
export const checkOwnershipStatus = (userId:string,doc:Document):boolean=>{
    try {
        console.log("user id from token:",userId)
        let userIdInDocument = doc.get("user_id");
        let isowner  = userId.toString() === userIdInDocument.toString()
        if (!isowner) {
            return false
        }
        return true
        
    } catch (error) {
            console.log(error)
            return false
    }   
}