import { Date } from "mongoose";
import { updateClockActionEnum } from "./enums";

export type TimeScheduleRequestBody = {
    clock_in:Date,
    clock_out:Date,
    break_duration:Number,
}

export type CreateScheduleRequestBody = {
    clock_me_user_site_assigned_id:String,
    time_Schedule:TimeScheduleRequestBody[],
}

export type UpdateClockRequestBody = {
    action:updateClockActionEnum,
    value:Date
}