import { Request, Response } from "express";

export const testFunction =(req:Request,res:Response)=>{
    res.status(200).json({message:"welcome to prise"})
}