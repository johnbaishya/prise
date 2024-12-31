import mongoose, { Schema } from "mongoose";
import { clockStatusEnum } from "../types/enums";

const clockMeUserSiteScheduleSchema = new Schema(
  {
    clock_me_user_site_assigned_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    clock_in:Date,
    clock_out:Date,
    break_duration:Number,
    status: {
      type: String,
      required: true,
      enum: Object.values(clockStatusEnum), // Example status values
      default: clockStatusEnum.active,
    },
    total_hour:Number
  },
  {
    timestamps: true,
  }
);

const ClockMeUserSiteSchedule =
  mongoose.models.ClockMeUserSiteSchedule || mongoose.model("ClockMeUserSiteSchedule", clockMeUserSiteScheduleSchema);

export default ClockMeUserSiteSchedule;
