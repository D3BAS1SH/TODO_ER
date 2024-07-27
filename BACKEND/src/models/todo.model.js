import mongoose,{Schema} from "mongoose";

const TodoSchema=new Schema({
    Heading:{
        type:String,
        required:true,
        trim:true,
    },
    Color:{
        type:String,
    },
    Completed:{
        type:Boolean
    }
},{timestamps:true})

export const Todo = mongoose.model("Todo",TodoSchema)