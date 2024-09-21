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
    const newOrder = highestOrder?highestOrder.Order+1:1;

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

const UpdateSubTodo = asynHandler(async(req,res)=>{
    const {subtodoid} = req.params;
    const {Content,Completed,Color} = req.body;
    const userID = req.user?._id;

    if(!subtodoid){
        throw new ApiError(400,"No Subtodo ID")
    }
    if(!mongoose.Types.ObjectId.isValid(subtodoid)){
        throw new ApiError(400,"Invalid Subtodo ID")
    }
    if(!(Content||Completed||Color)){
        throw new ApiError(400,"No data sent to change.")
    }

    const UpdatedSubtodo = await SubTodo.findOneAndUpdate({_id:subtodoid,User:userID},{Content,Color,Completed},{new:true});

    if(!UpdatedSubtodo){
        throw new ApiError(400,"Subtodo Update failed.")
    }

    return res.status(201).json(new ApiResponse(201,UpdatedSubtodo,"Update Subtodo Successful."))
})

const DeleteSubtodo = asynHandler(async(req,res)=>{
    const {subtodoid} = req.params;
    const userID = req.user?._id;

    if(!subtodoid){
        throw new ApiError(400,"No Subtodo ID")
    }
    if(!mongoose.Types.ObjectId.isValid(subtodoid)){
        throw new ApiError(400,"Invalid Subtodo ID")
    }

    const deleteSubtodoResponse = await SubTodo.findOneAndDelete({_id:subtodoid,User:userID})

    if(!deleteSubtodoResponse){
        throw new ApiError(400,"Failed in deleting a subtodo")
    }

    await Todo.updateOne(
        {_id:deleteSubtodoResponse.Parent},
        {
            $pull:{Subtodos:subtodoid}
        }
    )

    return res.status(200).json(new ApiResponse(200,{},"Subtodo Deleted succesfully."))
})

export {
    AddSubTodo,
    UpdateSubTodo,
    DeleteSubtodo
}