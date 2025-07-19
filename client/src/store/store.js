import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import popupReducer from "./slices/popUpSlice.js"

export const store = configureStore({
    reducer : {
        auth : authReducer,
        popup : popupReducer
    },
})