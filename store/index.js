import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist';
import userReducer from "./actions/User/UserSlice";

const rootReducer = combineReducers({
    userData: userReducer,
});

const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk],
});

export default store;