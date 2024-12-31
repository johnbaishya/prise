import { Response } from "express";

export const sendErrorResponse = (res:Response,error:unknown)=>{
    res.status(500).send(error);
}

export const sendResponseWithMessage = (res:Response,status:number,message:String)=>{
    res.status(status).json({message})
}

export const sendSuccessResponse = (res:Response,data:Object)=>{
    res.status(200).json(data);
}