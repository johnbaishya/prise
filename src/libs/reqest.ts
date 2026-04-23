import { Response } from "express";

export const sendErrorResponse = (res:Response,error:any)=>{
    res.status(error.status || 500).send(error.message || "An error occurred");
}

export const sendResponseWithMessage = (res:Response,status:number,message:String)=>{
    res.status(status).json({message})
}

export const sendSuccessResponse = (res:Response,data:Object)=>{
    res.status(200).json(data);
}