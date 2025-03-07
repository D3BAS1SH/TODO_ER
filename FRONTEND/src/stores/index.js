import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth.slice.js";

//configure persistor
const persistConfig = {
    key:'auth',
    storage
}

//Creating persist Reducer from normal reducer
const persistedReducer = persistReducer(persistConfig,authReducer);

export const Store = configureStore({
    reducer:{
        auth:persistedReducer,
    },
})

//Persistor
export const persistor = persistStore(Store);

//Checking changes
Store.subscribe(() => {
    console.log("Redux State Updated →", Store.getState());
  });