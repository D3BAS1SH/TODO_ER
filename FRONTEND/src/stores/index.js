import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./auth.slice.js";

export const authStore = configureStore({
    reducer:{
        auth:AuthReducer
    }
})