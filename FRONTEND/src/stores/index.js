import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth.slice.js";
import todoReducer from './todo.slice.js';
import subtoReducer from "./subtodo.slice.js";

const rootReducer = combineReducers({
    auth:authReducer,
    todo:todoReducer,
    subtodo:subtoReducer
})

//configure persistor
const persistConfig = {
    key:'root',
    storage,
    whitelist:["auth","todo","subtodo"]
}

//Creating persist Reducer from normal reducer
const persistedReducer = persistReducer(persistConfig,rootReducer);

export const Store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REGISTER', 'persist/REHYDRATE'],
        },
    }),
})

//Persistor
export const persistor = persistStore(Store);

//Checking changes
Store.subscribe(() => {
    console.log("Redux State Updated →", Store.getState());
});