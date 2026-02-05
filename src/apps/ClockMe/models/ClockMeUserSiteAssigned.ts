import mongoose, { Schema } from "mongoose";

const clockMeUserSiteAssignedSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    clock_me_site_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "ClockMeSite", 
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "cancelled","completed"], // Example status values
      default: "active",
    }
  },
  {
    timestamps: true,
  }
);

const ClockMeUserSiteAssigned =
  mongoose.models.ClockMeUserSiteAssigned || mongoose.model("ClockMeUserSiteAssigned", clockMeUserSiteAssignedSchema);

export default ClockMeUserSiteAssigned;
