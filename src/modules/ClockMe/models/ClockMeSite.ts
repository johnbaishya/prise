import mongoose, { Document, Model, Schema } from "mongoose";

const clockMeSiteSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    company_id:{
        type:Schema.Types.ObjectId,
        ref:"Company",
    },
    address:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:false,
    },
    lat:{
        type:Number,
        required:false
    },
    lon:{
        type:Number,
        required:false
    }

},{
    timestamps:true,
})

const ClockMeSite= mongoose.models.ClockMeSite||  mongoose.model('ClockMeSite', clockMeSiteSchema)

export default ClockMeSite;