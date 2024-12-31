import { Response } from "express";
import { sendErrorResponse, sendResponseWithMessage, sendSuccessResponse } from "../../../libs/reqres";
import { UserRequest } from "../../../Types/request";
import ClockMeUserSiteAssigned from "../models/ClockMeUserSiteAssigned";
import Clock from "../models/Clock";
import { checkOwnership } from "../../../libs/auth";
import { UpdateClockRequestBody } from "../types/reqBodyTypes";
import { clockStatusEnum, updateClockActionEnum } from "../types/enums";


export const checkUserHasRunningClock = async(req:UserRequest,res:Response)=>{
    try {
        let user_id = req.user?.id;
        let runningClock = await Clock.findOne({
            user_id,
            status:{$in:[clockStatusEnum.active,clockStatusEnum.inactive]}
        })
        if(runningClock){
            sendResponseWithMessage(res,400,"you already have an ongoing clock. please end that clock first")
            return true;
        }
        return false;
    } catch (error) {
        console.log("error from checkUserHasRunningClock",error);
        sendErrorResponse(res,error)
        return true
    }
}


export const startClock = async(req:UserRequest,res:Response)=>{
    try {
        // cheking if user has already started and not ended any other clock (onGoing clock / running clock);
        let hasRunningClock = await checkUserHasRunningClock(req,res);
        if(hasRunningClock){
            return;
        }
        let user_id = req.user?.id;
        let clock_me_site_id = req.params.id;
        let isUserAssignedToSite = await ClockMeUserSiteAssigned.findOne({user_id,clock_me_site_id});
        if(!isUserAssignedToSite){
            sendResponseWithMessage(res,400,"you are not authorized for this site");
            return;
        }
        let clock_in = new Date().toISOString();
        let clock = await Clock.create({user_id,clock_me_site_id,clock_in});
        sendSuccessResponse(res,clock);
    } catch (error) {
        console.log("error from start clock",error);
        sendErrorResponse(res,error);
    }
}



export const updateClock = async(req:UserRequest,res:Response)=>{
    try {
        let userId = req.user?.id;
        let clockId = req.params.id;
        let body:UpdateClockRequestBody= req.body;
        let clock = await Clock.findById(clockId);
        if(!clock){
            sendResponseWithMessage(res,400,"clock  data not found");
            return;
        }
        let isOwner = checkOwnership(req,res,clock);
        if(!isOwner){
            return;
        }
        let currentTime = new Date().toISOString();
        let axnEnm = updateClockActionEnum;
        let action = body.action;
        let status:clockStatusEnum = clockStatusEnum.active;
        switch (action) {
            case axnEnm.clock_out:
                status = clockStatusEnum.completed;
                break;
            case axnEnm.break_start:
                status = clockStatusEnum.inactive;
                break
            case axnEnm.break_end:
                status = clockStatusEnum.active;
            default:
                break;
        }
        let newBody = {
            [action]:currentTime,
            status
        }

        let updatedClock = await Clock.findByIdAndUpdate(clockId,newBody,{new:true})
        sendSuccessResponse(res,updatedClock);
    } catch (error) {
        console.log("error from updateClock",error);
        sendErrorResponse(res,error);
    }
}