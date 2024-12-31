import { Response } from "express";
import { UserRequest } from "../../../Types/request";
import ClockMeUserSiteAssigned from "../models/ClockMeUserSiteAssigned";
import ClockMeSite from "../models/ClockMeSite";
import { checkOwnership } from "../../../libs/auth";
import { CreateScheduleRequestBody, TimeScheduleRequestBody } from "../types/reqBodyTypes";
import ClockMeUserSiteSchedule from "../models/ClockMeUserSiteSchedule";
import { sendErrorResponse, sendResponseWithMessage, sendSuccessResponse } from "../../../libs/reqres";
import { Document } from "mongoose";


/*
post bosy structure is
{
    clock_me_user_site_assigned_id:id,
    time_Schedule =[{
        clock_in:date,
        clock_out:date,
        break_duration:timeDuration
    },{...}]
}
 */



export const createSchedule = async(req:UserRequest,res:Response)=>{
    try {
        let body:CreateScheduleRequestBody = req.body;
        let userSiteAssignedId = body.clock_me_user_site_assigned_id;
        let userSiteAssigned = await ClockMeUserSiteAssigned.findById(userSiteAssignedId);
        if(!userSiteAssigned){
            res.status(400).json({message:"user site assigned data not found"})
            return;
        }
        
        let siteId = userSiteAssigned.clock_me_site_id;
        let site = await ClockMeSite.findById(siteId);
        if(!site){
            res.status(400).json({message:"site not found"})
            return;
        }
        
        let isOwner =  checkOwnership(req,res,site);
        if(!isOwner){
            return;
        }
        let newRecords = body.time_Schedule.map((item:TimeScheduleRequestBody)=>{
            return{
                clock_me_user_site_assigned_id:body.clock_me_user_site_assigned_id,
                clock_in:item.clock_in,
                clock_out:item.clock_out,
                break_duration:item.break_duration
            }
        });
        let savedData = await ClockMeUserSiteSchedule.insertMany(newRecords);
        res.status(201).json(savedData);
    } catch (error) {
        console.log("error from create schedule",error);
        sendErrorResponse(res,error)
    }
}

const checkIsSchedculeCreator = async(req:UserRequest,res:Response,schedule:any):Promise<boolean>=>{
    try {
        // let scheduleId = req.params.id;
        // let schedule = await ClockMeUserSiteSchedule.findById(scheduleId);
        // checking if schedule exist
        if(!schedule){
            sendResponseWithMessage(res,400,"Schedule not found");
            return false;
        }
        let clock_me_user_site_assigned_id = schedule.clock_me_user_site_assigned_id;
        let UserSiteAssign = await ClockMeUserSiteAssigned.findById(clock_me_user_site_assigned_id);

        // checking is the user site assigned data exists
        if(!UserSiteAssign){
            sendResponseWithMessage(res,400,"user site assign not found");
            return false;
        }
        let siteId = UserSiteAssign.clock_me_site_id;
        let site = await ClockMeSite.findById(siteId);

        // checking if site exists
        if(!site){
            sendResponseWithMessage(res,400,"site not found");
            return false;
        }

        let isowner  = checkOwnership(req,res,site);
        // checking if the current user owns the site
        if(!isowner){
            return false;
        }
        return true;
    } catch (error) {
        console.log("error from updateSchedule");
        sendErrorResponse(res,error);
        return false;
    }
}

export const updateSchedule = async(req:UserRequest,res:Response)=>{
    try {
        let scheduleId = req.params.id;
        let schedule = await ClockMeUserSiteSchedule.findById(scheduleId);
        // // checking if schedule exist
        // if(!schedule){
        //     sendResponseWithMessage(res,400,"Schedule not found");
        //     return;
        // }
        // let clock_me_user_site_assigned_id = schedule.clock_me_user_site_assigned_id;
        // let UserSiteAssign = await ClockMeUserSiteAssigned.findById(clock_me_user_site_assigned_id);

        // // checking is the user site assigned data exists
        // if(!UserSiteAssign){
        //     sendResponseWithMessage(res,400,"user site assign not found");
        //     return;
        // }
        // let siteId = UserSiteAssign.clock_me_site_id;
        // let site = await ClockMeSite.findById(siteId);

        // // checking if site exists
        // if(!site){
        //     sendResponseWithMessage(res,400,"site not found");
        //     return;
        // }

        // let isowner  = checkOwnership(req,res,site);
        // // checking if the current user owns the site
        // if(!isowner){
        //     return;
        // }
        let isScheduleCreator = await checkIsSchedculeCreator(req,res,schedule);
        if(!isScheduleCreator){
            return;
        }
        let updatedSchedule = await ClockMeUserSiteSchedule.findByIdAndUpdate(scheduleId,req.body,{new:true});
        sendSuccessResponse(res,updatedSchedule)
    } catch (error) {
        console.log("error from updateSchedule");
        sendErrorResponse(res,error);
    }
}



export const getScheduleByUserSiteAssign = async(req:UserRequest,res:Response)=>{
    // need to make it (only be accessible by site owner and assigned user) for later
    try {
        let userSiteAssignId = req.params.id;
        let userSiteAssigned  = await ClockMeUserSiteAssigned.findById(userSiteAssignId);
        if(!userSiteAssigned){
            res.status(400).json({message:"user site assigned not found"});
            return;
        }
        let schedules = ClockMeUserSiteSchedule.find({clock_me_user_site_assigned_id:userSiteAssignId});
        res.status(200).json(schedules);
    } catch (error) {
        console.log("error from getSchedulesByUserSiteAssign",error);
        sendErrorResponse(res,error);
    }
}


export const getScheduleDetail = async(req:UserRequest,res:Response)=>{
    try {
        let scheduleId = req.params.id;
        let schedule = ClockMeUserSiteSchedule.findById(scheduleId);
        if(!schedule){
            sendResponseWithMessage(res,400,"schedule not found")
            return
        }
        res.status(200).json(schedule);
    } catch (error) {
        console.log("error getScheduleDetail",error);
        sendErrorResponse(res,error);
    }
}


export const deleteSchedule = async(req:UserRequest,res:Response)=>{
    try {
        let scheduleId = req.params.id;
        let schedule = await ClockMeUserSiteSchedule.findById(scheduleId);
        let isScheduleCreator = await checkIsSchedculeCreator(req,res,schedule);
        if(!isScheduleCreator){
            return;
        }
        await ClockMeUserSiteSchedule.findByIdAndDelete(scheduleId);
        sendResponseWithMessage(res,200,"Schedule Deleted successfully")
    } catch (error) {
        console.log("error from deleteSchedule",error);
        sendErrorResponse(res,error);
    }
}