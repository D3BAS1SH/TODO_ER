import {createSlice} from '@reduxjs/toolkit';

const initialState={
    availableTodos:[],
    newTodos:[],
    updateTodos:[],
    loading:false,
    error:null,
    selectedTodo:null
}

const todoSlice=createSlice({
    name:"Todos",
    initialState,
    reducers:{
        setLoading:(state,action)=>{
            state.loading=action.payload;
        },
        setError:(state,action)=>{
            state.error=action.payload;
        },
        setAvailableTodos:(state,action)=>{
            state.availableTodos=action.payload;
        },
        setNewTodos:(state,action)=>{
            state.newTodos.push(action.payload)
        },
        confirmNewTodo:(state,action)=>{
            const confirmedTodos= action.payload;
            state.availableTodos=[...state.availableTodos,...confirmedTodos];
            state.newTodos=[];
        },
        setUpdateTodos:(state,action)=>{
            state.updateTodos.push(action.payload);
        },
        confirmUpdateTodos:(state,action)=>{
            const updatedTodos=action.payload;
            state.availableTodos = state.availableTodos.map(todo=>{
                const updatedTodo = updatedTodos.find(ut=>ut._id===todo._id);
                return updatedTodo||todo;
            });
            state.updateTodos=[];
        },

    }
})

export const {
    confirmNewTodo,
    confirmUpdateTodos,
    setAvailableTodos,
    setError,
    setLoading,
    setNewTodos,
    setUpdateTodos
} = todoSlice.actions;

export const todoReducer = todoSlice.reducer;

/*const todoSlice = createSlice({
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

export default todoSlice.reducer;*/