import { configureStore } from "@reduxjs/toolkit";
import galleryReducer from "./gallerySlice";
import userReducer from "./userSlice";

export const store = configureStore({
    reducer:{
        gallery : galleryReducer,
        user : userReducer
    },
});
