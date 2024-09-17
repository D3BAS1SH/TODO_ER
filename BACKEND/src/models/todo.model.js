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
        type:Boolean,
        default:false
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    Subtodos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubTodo"
        }
    ],
    Order:{
        type:Number,
        default:0
    }
},{timestamps:true})

TodoSchema.plugin(mongooseAggregatePaginate)

export const Todo = mongoose.model("Todo",TodoSchema)