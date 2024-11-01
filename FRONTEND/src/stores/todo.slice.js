import {createSlice} from '@reduxjs/toolkit';

const initialState={
    todos:[],
    loading:false,
    error:null,
    selectedTodo:null
}

const todoSlice = createSlice({
    name:"Todos",
    initialState,
    reducers:{
        setLoading:(state,action)=>{
            state.loading=action.payload;
        },
        setError:(state,action)=>{
            state.error=action.payload;
        },
        setSelectedTodo:(state,action)=>{
            state.selectedTodo=action.payload;
        },
        setTodo:(state,action)=>{
            state.todos=action.payload;
            state.loading=false
        },
        setAddTodo:(state,action)=>{
            state.todos.push(action.payload)
        },
        updateTodo:(state,action)=>{
            const index = state.todos.findIndex(todo=>todo._id==action.payload._id);
            if(index!==-1){
                state.todos[index]=action.payload;
            }
        },
        deleteTodo:(state,action)=>{
            state.todos=state.todos.filter(todo=>todo._id!==action.payload)
        }
    }
})

export const {
    deleteTodo,
    setAddTodo,
    setError,
    setLoading,
    setSelectedTodo,
    setTodo,
    updateTodo
} = todoSlice.actions

export default todoSlice.reducer; 