import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

TodoSchema.plugin(mongooseAggregatePaginate)

export const Todo = mongoose.model("Todo",TodoSchema)