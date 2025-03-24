import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import todoService from '../services/todo.service.js';
const initialState={
    todos:[],
    loading:false,
    error:null,
    selectedTodo:null
}

export const createTodoThunk = createAsyncThunk(
    "todo/CreateTodo",
    async(todoObject,{rejectWithValue})=>{
        try {
            if(!todoObject){
                throw new Error("No todo object provided");
            }
            const response = await todoService.createTodo(todoObject);
            console.log("Response of Create Todo :-> ");
            console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.message||"Todo Creation Failed.")
        }
    }
)

const todoSlice=createSlice({
    name:"Todos",
    initialState,
    extraReducers:(builder)=>{
        builder
        .addCase(createTodoThunk.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(createTodoThunk.fulfilled,(state,action)=>{
            console.log(action.payload);
            state.error=null;
            state.loading=false;
            state.todos.push(action.payload.data);
        })
        .addCase(createTodoThunk.rejected,(state,action)=>{
            state.error=action.error.message;
            state.loading=false;
            state.selectedTodo=state.selectedTodo;
        })
    }
})

export default todoSlice.reducer;