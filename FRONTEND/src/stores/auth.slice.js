import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import UserAuthService from "../services/auth.service.js";
import {toast} from "react-hot-toast";

const initialState={
    user:null,
    isAuthenticated:false,
    loading:false,
    error:null
}

//Async Thunks
export const RegisterUser = createAsyncThunk(
    "auth/register",
    async(userdata,{rejectWithValue})=>{
        try {
            const response = await UserAuthService.register(userdata);
            toast.success("Registration Succesful");
            return response.data;
        } catch (error) {
            toast.error(error.message||"Registration failed");
            return rejectWithValue(error.message);
        }
    }
)

export const LoginUser = createAsyncThunk(
    "auth/login",
    async(credentials,{rejectWithValue})=>{
        try {
            const response = await UserAuthService.login(credentials);
            toast.success("Login Successful");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const LoginOut = createAsyncThunk(
    "auth/logout",
    async(_,{rejectWithValue})=>{
        try {
            const response = await UserAuthService.logout();
            toast.success("Logout Succesful");
            return response;
        } catch (error) {
            toast.error("Logout Failed");
            return rejectWithValue(error.message);
        }
    }
)

export const RefreshToken = createAsyncThunk(
    "auth/refreshtoken",
    async(_,{rejectWithValue})=>{
        try {
            const response = await UserAuthService.getRefreshTokens()
            toast.success("Token Generation Succesful");
            return response;
        } catch (error) {
            toast.error("Token Generation Failed");
            return rejectWithValue(error.message);
        }
    }
)

export const GetCurrentUser = createAsyncThunk(
    "auth/getcurrentuser",
    async(_,{rejectWithValue})=>{
        try {
            const response = await UserAuthService.getCurrentUser();
            toast.success("User Information Gathering Succesful");
            return response.data;
        } catch (error) {
            toast.error("User Information Gathering Failed");
            return rejectWithValue(error.message);
        }
    }
)

const authSlice = createSlice({
    name:"Auth",
    initialState,
    reducers:{
        clearAuth:(state)=>{
            state.user=null,
            state.isAuthenticated=false
            state.loading=false,
            state.error=null
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(RegisterUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(RegisterUser.fulfilled,(state,action)=>{
            state.user=action.payload;
            state.error=null;
            state.isAuthenticated=false;
            state.loading=false;
        }).addCase(RegisterUser.rejected,(state,action)=>{
            state.error=action.payload;
            state.loading=false
        })
        .addCase(LoginUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(LoginUser.fulfilled,(state,action)=>{
            state.error=null;
            state.user=action.payload.data.user;
            state.isAuthenticated=true;
            state.loading=false;
        })
        .addCase(LoginUser.rejected,(state,action)=>{
            console.log("Rejected stuff error in login")
            state.error=action.payload;
            state.loading=false;
        })
        .addCase(LoginOut.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(LoginOut.fulfilled,(state,action)=>{
            state.error=null;
            state.isAuthenticated=false;
            state.loading=false;
            state.user=null;
        })
        .addCase(LoginOut.rejected,(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        })
        .addCase(RefreshToken.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(RefreshToken.fulfilled,(state,action)=>{
            state.error=null;
            state.isAuthenticated=true;
            state.loading=false;
            state.user=action.payload;
        })
        .addCase(RefreshToken.rejected,(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        })
        .addCase(GetCurrentUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(GetCurrentUser.fulfilled,(state,action)=>{
            state.error=null;
            state.isAuthenticated=true;
            state.loading=false;
            state.user=action.payload;
        })
        .addCase(GetCurrentUser.rejected,(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        })
    }
})

export const {clearAuth} = authSlice.actions;
export default authSlice.reducer;