import {createSlice} from '@reduxjs/toolkit'

const initialState={
    user:null,
    isAuthenticated:false,
    loading:false,
    error:null
}

const authSlice = createSlice({
    name:"Auth",
    initialState,
    reducers:{
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload
            state.loading=false
        },
        setUser:(state,action)=>{
            state.user=action.payload;
            state.loading=false;
            state.isAuthenticated= !!action.payload;
        },
        clearAuth:(state)=>{
            state.user=null,
            state.isAuthenticated=false
            state.loading=false,
            state.error=null
        }
    }
})

export const {clearAuth,setError,setLoading,setUser} = authSlice.actions;
export default authSlice.reducer;