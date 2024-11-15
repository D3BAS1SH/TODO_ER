import { createSlice } from "@reduxjs/toolkit";

const initialState={
    loading:false,
    error:null,
    availableSubtodos:{},
    newSubTodos:[],
    updatedSubTodos:[],
}

const subtodoSlice = createSlice(
    {
        name:"Subtodo",
        initialState,
        reducers:{
            setLoading:(state,action)=>{
                state.loading=action.payload;
            },
            setError:(state,action)=>{
                state.error=action.payload;
            },
            setAvailableSubtodos:(state,action)=>{
                const subtodoByParentTodo = action.payload.reduce((acc,subtodo)=>{
                    if(!acc[subtodo.Parent]){
                        acc[subtodo.Parent]=[];
                    }
                    acc[subtodo.Parent].push(subtodo);
                    return acc;
                },{});
                state.availableSubtodos=subtodoByParentTodo;
            },
            setNewSubTodos:(state,action)=>{
                state.newSubTodos.push(action.payload);
            },
            confirmSubTodoCreation:(state,action)=>{
                const confirmedSubtodos = action.payload;
                state.availableSubtodos.forEach(subtodo => {
                    if(!state.availableSubtodos[subtodo.Parent]){
                        state.availableSubtodos[subtodo.Parent]=[];
                    }
                    state.availableSubtodos[subtodo.Parent].push(subtodo);
                });
                state.newSubTodos=[];
            },
            setUpdateSubtodos:(state,action)=>{
                state.updatedSubTodos.push(action.payload);
            },
            confirmSubtodoUpdate:(state,action)=>{
                const confiremSubtodos = action.payload;
                confiremSubtodos.forEach(subtodo=>{
                    if(state.availableSubtodos[subtodo.Parent]){
                        state.availableSubtodos[subtodo.Parent]=state.availableSubtodos[subtodo.Parent].map(ut=>{
                            ut._id===subtodo._id ? subtodo : ut;
                        })
                    }
                });
                state.updatedSubTodos=[];
            },
            deleteSubtodo:(state,action)=>{
                const {parentId,subtodoId} = action.payload;
                if(state.availableSubtodos[parentId]){
                    state.availableSubtodos[parentId]=state.availableSubtodos[parentId].filter(subtodo=>subtodo._id!==subtodoId);
                }
            }
        }
    }
)

export const {
    confirmSubTodoCreation,
    confirmSubtodoUpdate,
    deleteSubtodo,
    setAvailableSubtodos,
    setError,
    setLoading,
    setNewSubTodos,
    setUpdateSubtodos
} = subtodoSlice.actions;
export const subtodoReducer = subtodoSlice.reducer;