import { configureStore } from "@reduxjs/toolkit";
import galleryReducer from "./gallerySlice";
import userReducer from "./userSlice";
import notificationReduder from "./notificationSlice"

export const store = configureStore({
    reducer:{
        gallery : galleryReducer,
        user : userReducer,
        notifications: notificationReduder
    },
});
