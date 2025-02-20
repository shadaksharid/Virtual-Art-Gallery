import API from "../axios";
import { likeArtworkSuccess } from "./gallerySlice";

export const likeArtwork = (id) => async (dispatch) => {
    try{
        const response = await API.put(`/artworks/${id}/like`);
        console.log("API Response:", response.data);
        dispatch(likeArtworkSuccess({ id, likes: response.data.likes }));
    }catch(error){
        console.error("Error liking art", error);
    }
};
