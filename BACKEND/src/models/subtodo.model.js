import mongoose, {Schema} from "mongoose";

const SubtodoSchema = new Schema({
    Content:{
        type:String,
        required:true,
    },
    Completion:{
        type:Boolean,
    },
    Color:{
        type:String,
    },
    Parent:{
        type:mongoose.Schema.ObjectId,
        ref:"Todo",
        required:true
    }
},{timestamps:true})

export const SubTodo = mongoose.model("SubTodo",SubtodoSchema)