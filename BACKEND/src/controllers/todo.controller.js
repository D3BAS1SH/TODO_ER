import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynHandler } from "../utils/asyncHandler.js";
import {Todo} from '../models/todo.model.js';

const CreateTodo = asynHandler(async(req,res)=>{
    const {Heading,Color} = req.body;
    const userID = req.user?._id;

    const highestOrder = await Todo.findOne({User:userID}).sort("-Order").limit(1);
    
    const newOrder = highestOrder? highestOrder.Order+1:1;

    if(!Heading){
        throw new ApiError(400,"Heading is required.")
    }

    if(!userID){
        throw new ApiError(403,"Forbidden and unauthorized access.")
    }

    const TodoCreatedResponse = await Todo.create({
        Heading:Heading,
        Color:Color,
        User:userID,
        Order:newOrder
    })

    console.log("Todo Created");
    console.log(TodoCreatedResponse);

    return res.status(200).json(new ApiResponse(200,TodoCreatedResponse,"create Todo Working."))
})

const UpdateTodo = asynHandler(async(req,res)=>{
    const { id } = req.params;
    const { Heading, Color, Completed } = req.body;
    const userID = req.user?._id;

    if(!id){
        throw new ApiError(400,"Invalid Request");
    }

    if(!(Heading || Color || Completed)){
        throw new ApiError(400,"Nothing to change");
    }
    
    const UpdateResponse = await Todo.findByIdAndUpdate({_id:id,User:userID},{Heading,Color,Completed},{new:true})

    console.log("Updated Successfully");

    if(!UpdateResponse){
        throw new ApiError(404,"Todo Object not found.")
    }

    return res.status(201).json(new ApiResponse(201,UpdateResponse,"Todo Updated Successfully."))
})

const getAllTodo = asynHandler(async(req,res)=>{
    const {page=1,limit=10} = req.query
    const userID = req.user?._id;

    if(!userID){
        throw new ApiError(403,"Unauthorised Request.")
    }

    const options={
        page:parseInt(page,10),
        limit:parseInt(limit,10),
    }

    const PaginatedTodos = await Todo.aggregatePaginate([
        {
            $match:{User:userID}
        },
        {
            $lookup:{
                from:'Subtodos',
                localField:"_id",
                foreignField:"Parent",
                as:"Subtodos"
            }
        },
        {
            $addFields:{
                subTodoCount:{
                    $size:"$Subtodos"
                }
            }
        },
        {
            $sort:{subTodoCount:-1}
        }
    ],options);
    
    if(!PaginatedTodos){
        throw new ApiError(400,"Document Can't be fetched.")
    }

    return res.status(200).json(new ApiResponse(200,PaginatedTodos,"Document fetched."))
})

export {
    CreateTodo,
    UpdateTodo,
    getAllTodo
}