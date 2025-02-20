import React, { useEffect, useState } from "react";
import "../styles/Gallery.css";
import "../styles/app_style.css";
import API from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworksStart,fetchArtworksSuccess,fetchArtworksFailure } from "../redux/gallerySlice";


 const Gallery = () => {
    const dispatch = useDispatch();
    const {artworks, loading, error} = useSelector((state) => state.gallery);
    const [selectedArtwork, setSelectedArtwork] = useState(null);

    useEffect(() => {
      const fetchArtworks = async () => {
        dispatch(fetchArtworksStart());
        try{
          const response = await API.get("/artworks");
          dispatch(fetchArtworksSuccess(response.data));
        }catch (err) {
          console.error("Error fetching artworks");
          dispatch(fetchArtworksFailure("Failed to fetch artworks"));
        }
      };
      fetchArtworks();
    },[dispatch]);

    const openDetailView = (art) => {
      setSelectedArtwork(art);
    }

    const closeDetailView = () => {
      setSelectedArtwork(null);
    }

    
    return(
        <div className="gallery-container container mt-5">
            <h2 className="text-center mb-4">Art Gallery</h2>

            {loading && <p className="text-center">Loading artworks...</p>}
            {error && <p className="text-center text-danger">{error}</p>}
            {!loading && artworks.length === 0 && <p className="text-center">No artworks available.</p>}

            <div className="row">
                {artworks.map((art) => (
                    <div key={art._id} className="col-md-4 mb-4" onClick={() => openDetailView(art)}> 
                    <div className="card h-100">
                        <img src={art.imageUrl} alt={art.title}/>
                        <div className="card-body">
                        <h3>{art.title}</h3>
                        <p>By {art.artist}</p>    
                        </div>
                    </div>
                    </div>
                ))}
            </div>
            {selectedArtwork && (
              <div className="modal-overlay" onClick={closeDetailView}>
                <div className="modal-content card p-4" onClick={(e) => e.stopPropagation}>
                  <span className="close-button btn btn-danger" onClick={closeDetailView}>&times;</span>
                  <img src={selectedArtwork.imageUrl} alt={selectedArtwork.title} className="img-fluid mb-3"/>
                  <h2>{selectedArtwork.title}</h2>
                  <p><strong>Artist:</strong> {selectedArtwork.artist}</p>
                  <p><strong>Description:</strong> {selectedArtwork.description || "No description available."}</p>
                </div>
              </div>
            )}
        </div>
    );
};

export default Gallery;