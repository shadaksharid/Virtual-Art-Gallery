import API from "../axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserProfile = createAsyncThunk(
    "user/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
          const token = localStorage.getItem("token"); 
          const res = await API.get("/users/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          return res.data;
        } catch (error) {
          return rejectWithValue(error.response.data);
        }
      }
);

export const updateUserProfile = createAsyncThunk(
    "user/updateUserProfile",
    async(profileData, {rejectWithValue}) => {
        try{
            const token = localStorage.getItem("token");
            const res = await API.put("/users/profile",profileData,{
                headers : {Authorization : `Bearer ${token}`}
            });
            return res.data;
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
);

const userSlice = createSlice({
    name:"user",
    initialState:{
        user: null,
        status:"idle",
        error:null
    },
    reducers:{
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUserProfile.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.user = action.payload;
        })
        .addCase(fetchUserProfile.rejected, (state, action ) => {
            state.status = "failed";
            state.error = action.payload;
        })
        .addCase(updateUserProfile.fulfilled, (state, action) => {
            state.user = action.payload.user;
        })
    }
});

export const {logoutUser} = userSlice.actions;
export default userSlice.reducer;
