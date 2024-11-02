import { asynHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Todo } from "../models/todo.model.js";
import { SubTodo } from "../models/subtodo.model.js";
import mongoose from "mongoose";

//Constants for validations
const CONSTANTS={
    MAX_SUBTODO_PER_TODO:100,
    MAX_CONTENT_LENGHT:1000,
    MIN_CONTENT_LENGTH:1,
    DEFAULT_COLOR:'#000000',
    MAX_BATCH_SIZE:50
}

//Validation helper function
const validateColor = (color) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

const validateContent=(content)=>{
    if(!content) return false;
    const trimmedContent=content.trim();
    return trimmedContent.length>=CONSTANTS.MIN_CONTENT_LENGTH && trimmedContent.length <= CONSTANTS.MAX_CONTENT_LENGHT;
};

const BatchAddSubtodos = asynHandler(async(req,res)=>{
    const {todoId} = req.params;
    const {subtodos} = req.body;
    const userID = req.user?._id;

    if(!todoId||!mongoose.Types.ObjectId.isValid(todoId)){
        throw new ApiError(400,"Invalid Todo ID or unavailable ID.");
    }

    if(!Array.isArray(subtodos)){
        throw new ApiError(400,"The Subtodo(s) must be in an array")
    }

    if(subtodos.length===0){
        throw new ApiError(400,"Array is Empty, No subtodo to add.")
    }

    if(subtodos.length>CONSTANTS.MAX_BATCH_SIZE){
        throw new ApiError(400,`Array should not exceed the limit : ${CONSTANTS.MAX_BATCH_SIZE}`);
    }

    const Session = await mongoose.startSession();
    console.log(Session);
    
    try {
        await Session.startTransaction();
        
        const todo = await Todo.findOne({_id:todoId,User:userID}).session(Session);

        if(!todo){
            throw new ApiError(404,"Todo Not found or you don't have the access.")
        }

        const currentSubtodoLength = todo.Subtodos.length;
        if(currentSubtodoLength+subtodos.length>CONSTANTS.MAX_SUBTODO_PER_TODO){
            throw new ApiError(400,`The number subtodos are exceeding the limit by ${currentSubtodoLength+subtodos.length-CONSTANTS.MAX_SUBTODO_PER_TODO}`)
        }

        const highestOrder = await SubTodo.findOne({User:userID}).sort("-Order").select('Order').session(Session);

        let nextOrder = highestOrder ? highestOrder.Order + 1 : 1;

        const subtodosToCreate = subtodos.map((subtodo,index)=>{
            if(!validateContent(subtodo.Content)){
                throw new ApiError(400,`Invalid content length at the index${index}`)
            }

            if(subtodo.Color && !validateColor(subtodo.Color)){
                throw new ApiError(400,"Invalid Color Code. Use only Hex format");
            }

            return {
                Content:subtodo.Content,
                Color:subtodo.Color || CONSTANTS.DEFAULT_COLOR,
                Completed:Boolean(subtodo.Completed),
                Parent:todoId,
                User:userID,
                Order:nextOrder++
            };
        })

        const createdSubtodos = await SubTodo.create(subtodosToCreate,{session:Session});

        if(!createdSubtodos){
            throw new ApiError(500,"Failed to create Subtodos for internal server issue.")
        }

        todo.Subtodos.push(...createdSubtodos.map(subtodo=>subtodo._id))
        await todo.save({session:Session});

        await Session.commitTransaction();

        const ResponseData={
            created:createdSubtodos.length,
            totalSubtodos:todo.Subtodos.length,
            subtodos:createdSubtodos,
            remainingQuota:CONSTANTS.MAX_SUBTODO_PER_TODO-todo.Subtodos.length
        };

        return res.status(201).json(
            new ApiResponse(
                201,ResponseData,"Desired Subtodos Created Succesfully."
            )
        )

    } catch (error) {
        await Session.abortTransaction();
        if(error.code === 11000){
            throw new ApiError(400,"Duplicate subtodo content detected.")
        }

        throw error
    } finally{
        Session.endSession();
    }
})

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
    BatchAddSubtodos,
    AddSubTodo,
    UpdateSubTodo,
    DeleteSubtodo
}