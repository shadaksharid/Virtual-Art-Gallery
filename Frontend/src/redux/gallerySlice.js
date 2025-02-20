import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    artworks : [],
    loading : false,
    error : null,
}

const gallerySlice = createSlice({
    name : "gallery",
    initialState,
    reducers : {
        fetchArtworksStart : (state) => {
            state.loading = true;
        },
        fetchArtworksSuccess : (state, action) => {
            state.loading = false;
            state.artworks = action.payload;
        },
        fetchArtworksFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {fetchArtworksStart, fetchArtworksSuccess, fetchArtworksFailure} = gallerySlice.actions;
export default gallerySlice.reducer;