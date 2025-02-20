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
        likeArtworkSuccess : (state, action) => {
            const { id, likes } = action.payload;
            const artwork = state.artworks.find((art) => art._id === id);
            if (artwork) {
                artwork.likes = likes; 
            }
            state.artworks = state.artworks.map((art) =>
                art._id === id ? { ...art, likes } : art
            );
        },
    },
});

export const {fetchArtworksStart, fetchArtworksSuccess, fetchArtworksFailure, likeArtworkSuccess} = gallerySlice.actions;
export default gallerySlice.reducer;