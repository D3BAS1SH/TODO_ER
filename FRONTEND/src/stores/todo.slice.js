import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { REHYDRATE } from "redux-persist"
import todoService from '../services/todo.service.js';
const initialState={
    todos:[],
    loading:false,
    error:null,
    selectedTodo:null,
    _persist: {}
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

export const getAllTodoThunk = createAsyncThunk(
    'todo/GetAllTodo',
    async(ParamsValues,{rejectWithValue})=>{
        try {
            if(!ParamsValues){
                throw new Error("No Todo Params provided");
            }

            const response = await todoService.getAllTodo(ParamsValues);
            const incomingTodos = response.data.data.docs;
            const SubtodosOfIncomingTodos = incomingTodos.map((item)=>{
                return {
                    _id:item._id,
                    subtodos:item.Subtodos
                }
            })
            console.log(response);
            return {
                incomingTodos,
                SubtodosOfIncomingTodos
            };
        } catch (error) {
            return rejectWithValue(error?.message || "Todo Fetching failed.");
        }
    }
)

export const updateTodoThunk = createAsyncThunk(
    "todo/UpdateATodo",
    async(updateinfo,{rejectWithValue})=>{
        try {
            if(!updateinfo){
                return rejectWithValue("No updated value object provided.");
            }

            const response = await todoService.updateTodo(updateinfo);

            return {id:response.data.data._id,updatedTodo:response.data.data};
        } catch (error) {
            return rejectWithValue(error?.message || "Todo updation failed.");
        }
    }
)

export const deleteTodoThunk = createAsyncThunk(
    "todo/DeleteATodo",
    async(id,{rejectWithValue})=>{
        try {
            if(!id){
                return rejectWithValue("Id not provided.");
            }
            await todoService.deleteTodo(id);

            return id;
        } catch (error) {
            return rejectWithValue(error.message||"Failed during deletion of a todo.");
        }
    }
)

const todoSlice=createSlice({
    name:"Todos",
    initialState,
    reducers:{
        selectTodo: (state, action) => {
            state.selectedTodo = action.payload;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(REHYDRATE, (state, action) => {
            if (action.payload) {
                return {
                    ...state,
                    ...action.payload.todo,
                    loading: false,
                };
            }
        })
        .addCase(createTodoThunk.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(createTodoThunk.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.todos.push(action.payload.data);
            state.selectedTodo=action.payload.data._id;
        })
        .addCase(createTodoThunk.rejected,(state,action)=>{
            state.error=action.error.message;
            state.loading=false;
            state.selectedTodo=state.selectedTodo;
        })
        .addCase(getAllTodoThunk.pending,(state,_)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(getAllTodoThunk.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.todos=action.payload.incomingTodos;
            state.selectedTodo=state.selectedTodo;
        })
        .addCase(getAllTodoThunk.rejected,(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        })
        .addCase(deleteTodoThunk.pending,(state,_)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(deleteTodoThunk.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.todos=state.todos.filter(todo=> todo._id !== action.payload);
            state.selectedTodo=state.selectedTodo;
        })
        .addCase(deleteTodoThunk.rejected,(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        })
        .addCase(updateTodoThunk.pending,(state,_)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(updateTodoThunk.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            const index = state.todos.findIndex(todo=>todo._id===action.payload.id);
            state.todos[index] = action.payload.updatedTodo;
            state.selectedTodo = action.payload.id;
        })
        .addCase(updateTodoThunk.rejected,(state,action)=>{
            state.error=action.error;
            state.loading=false;
            state.selectedTodo=state.selectedTodo;
        })
    }
})

export const {selectTodo} = todoSlice.actions;
export default todoSlice.reducer;