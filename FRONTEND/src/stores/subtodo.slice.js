import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {getAllTodoThunk} from "./todo.slice.js"
import subtodoService from "../services/subtodo.service.js";

const initialState={
    loading:false,
    error:null,
    subtodos:[],
}

export const createSubTodoThunk = createAsyncThunk(
    "subtodo/createSubTodo",
    async(subTodoDoc,{rejectWithValue})=>{
        try {
            console.log("In Thunk");
            if(!subTodoDoc){
                return rejectWithValue("No Subtodo document provided.");
            }
            const {id,Content,Color,Completed} = subTodoDoc;
            const response = await subtodoService.createSubTodo({todoid:id,subtodoObj:{Content,Color,Completed}});
            return response.data;
        } catch (error) {
            console.log("Create Subtodo thunk failed.");
            return rejectWithValue(error?.message || "Error on creating subtodo");
        }
    }
)

export const deleteSubTodoThunk = createAsyncThunk(
    "subtodo/deleteSubTodo",
    async(subTodoDoc,{rejectWithValue})=>{
        try {
            const {subTodoId,parentId} = subTodoDoc;
            if(!subTodoId){
                return rejectWithValue("No subtodo object id provided -Thunk");
            }
            await subtodoService.deleteSubTodo({subTodoId:subTodoId});

            return {parent:parentId,subTodoId};
        } catch (error) {
            console.log("Subtodo Deletion failed");
            return rejectWithValue(error?.message||"Subtodo Deletion failed");
        }
    }
)

const subtodoSlice = createSlice(
    {
        name:"Subtodo",
        initialState,
        reducers:{
        },
        extraReducers:(builder)=>{
            builder
            .addCase(getAllTodoThunk.pending,(state,_)=>{
                state.error=null;
                state.loading=true;
            })
            .addCase(getAllTodoThunk.fulfilled,(state,action)=>{
                state.error=null;
                state.loading=false;
                state.subtodos=action.payload.SubtodosOfIncomingTodos;
            })
            .addCase(getAllTodoThunk.rejected,(state,action)=>{
                state.error=action.error;
                state.loading=false;
            })
            .addCase(createSubTodoThunk.pending,(state,_)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubTodoThunk.fulfilled,(state,action)=>{
                console.log("Payload received.");
                console.log("Where is _id?");
                state.loading = false;
                state.error = null;
                state.subtodos = state.subtodos.map(item=>{
                    if(item._id === action.payload.data.Parent){
                        return {...item,subtodos:[...item.subtodos,action.payload.data]}
                    }
                    return item;
                })
                console.log("Where is _id?");
            })
            .addCase(createSubTodoThunk.rejected,(state,action)=>{
                state.error=action.payload;
                state.loading=false;
            })
            .addCase(deleteSubTodoThunk.pending,(state,_)=>{
                state.error=null;
                state.loading=true;
            })
            .addCase(deleteSubTodoThunk.fulfilled,(state,action)=>{
                state.error=null;
                state.loading=false;
                const { parent, subTodoId } = action.payload;
                state.subtodos=state.subtodos.map(item=>{
                    if(item._id === parent){
                        return {
                            ...item,
                            subtodos:item.subtodos.filter(sub=>sub._id!==subTodoId)
                        }
                    }
                    return item
                })
            })
            .addCase(deleteSubTodoThunk.rejected,(state,action)=>{
                state.error=action.payload;
                state.loading=false;
            })
        }
    }
)

export default subtodoSlice.reducer;