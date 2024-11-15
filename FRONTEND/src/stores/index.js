import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./auth.slice.js";
import {todoReducer} from "./todo.slice.js";
import {subtodoReducer} from "./subtodo.slice.js";

export const Store = configureStore({
    reducer:{
        auth:AuthReducer,
        todo:todoReducer,
        subTodo:subtodoReducer
    }
})