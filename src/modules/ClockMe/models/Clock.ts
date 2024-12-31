import mongoose, { Schema } from "mongoose";
import { clockStatusEnum} from "../types/enums";

const clockSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        require:true,
    },
    clock_me_site_id:{
        type:Schema.Types.ObjectId,
        ref:"ClockMeSite",
        require:true
    },
    clock_in:{type:Date,required:true},
    clock_out:Date,
    break_start:Date,
    break_end:Date,
    status:{
        type:String,
        // enum:[cs.active,cs.inactive,cs.completed,cs.cancelled],
        enum:Object.values(clockStatusEnum),
        default:clockStatusEnum.active,
    },
    total_hour:Number,
},{
    timestamps:true,
})

const Clock = mongoose.models.Clock|| mongoose.model("Clock",clockSchema);
export default Clock;