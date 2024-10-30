import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./auth.slice.js";

export const Store = configureStore({
    reducer:{
        auth:AuthReducer
    }
})