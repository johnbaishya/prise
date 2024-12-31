import { Response } from "express";
import { UserRequest } from "../../../Types/request";

export const test1 =async (req:UserRequest,res:Response)=>{
    try {
        // let file = await uploadImage.single("image");
        let file = req.file;
        res.status(200).json(file);
        // console.log(file)
    } catch (error) {
        console.log("error from test 1",error);
    }
}