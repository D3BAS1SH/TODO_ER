import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {getAllTodoThunk} from "./todo.slice.js"

const initialState={
    loading:false,
    error:null,
    subtodos:[],
}

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
        }
    }
)

export default subtodoSlice.reducer;