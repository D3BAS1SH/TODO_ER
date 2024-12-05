import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice.js";

export const Store = configureStore({
    reducer:{
        auth:authReducer,
    },
})