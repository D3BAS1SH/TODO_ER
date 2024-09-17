import mongoose, {Schema} from "mongoose";

const SubtodoSchema = new Schema({
    Content:{
        type:String,
        required:true,
    },
    Completed:{
        type:Boolean,
    },
    Color:{
        type:String,
    },
    Parent:{
        type:mongoose.Schema.ObjectId,
        ref:"Todo",
        required:true
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    Order:{
        type:Number,
        default:0
    }
},{timestamps:true})

export const SubTodo = mongoose.model("SubTodo",SubtodoSchema)