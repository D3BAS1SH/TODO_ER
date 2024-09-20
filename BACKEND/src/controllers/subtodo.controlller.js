import { asynHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Todo } from "../models/todo.model.js";
import { SubTodo } from "../models/subtodo.model.js";
import mongoose from "mongoose";

const AddSubTodo = asynHandler(async(req,res)=>{

    const {todoId} = req.params;
    const {Content,Completed=false,Color="#000000"} = req.body;
    const userID = req.user?._id;

    console.log(todoId);
    console.log(userID);
    

    if(!todoId){
        throw new ApiError(404,"No such Todo ID is found")
    }

    if(!mongoose.Types.ObjectId.isValid(todoId)){
        throw new ApiError(403,"Invalid Todo Id")
    }

    if(!Content){
        throw new ApiError(404,"No content to be added as SubTodo.")
    }

    const theTodo = await Todo.findOne({_id:todoId,User:userID})

    if(!theTodo){
        throw new ApiError(400,"There is no such todo found on th given ID")
    }

    const highestOrder = await SubTodo.findOne({User:userID}).sort("-Order").limit(1);
    const newOrder = highestOrder?highestOrder+1:1;

    const subTodoAddResponse = await SubTodo.create({
        Content,Completed,Color,
        Parent:todoId,
        User:userID,
        Order:newOrder
    })

    theTodo.Subtodos.push(subTodoAddResponse._id);
    await theTodo.save();

    return res.status(201).json(new ApiResponse(201,subTodoAddResponse,"SubTodo Added successfully."))
})

export {
    AddSubTodo,
    
}