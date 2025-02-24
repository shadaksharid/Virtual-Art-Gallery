import React, { useEffect, useState } from "react";
import "../styles/Gallery.css";
import "../styles/app_style.css";
import API from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworksStart,fetchArtworksSuccess,fetchArtworksFailure,likeArtworkSuccess,commentArtworkSuccess } from "../redux/gallerySlice";


 const Gallery = () => {
    const dispatch = useDispatch();
    const {artworks, loading, error} = useSelector((state) => state.gallery);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [commentText, setCommentText] = useState("");

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
      setCommentText("");
    }

    const handleLike = async (artworkId) => {
      try {
          const response = await API.post(`/artworks/${artworkId}/like`);
          dispatch(likeArtworkSuccess(response.data.artwork));
      } catch (err) {
          console.error("Error liking artwork", err);
      }
  };

  const handleComment = async (artworkId) => {
    if (!commentText.trim()) return;
    try {
        const response = await API.post(`/artworks/${artworkId}/comment`, { text: commentText });
        dispatch(commentArtworkSuccess(response.data.artwork));
        setCommentText(""); 
    } catch (err) {
        console.error("Error adding comment", err);
    }
};
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
                        <button className="btn btn-primary mt-2" onClick={(e) => {e.stopPropagation(); handleLike(art._id);}}>
                            ❤️ {art.likes.length}
                        </button>  
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
                  <button className="btn btn-primary mb-3" onClick={() => handleLike(selectedArtwork._id)}>
                            ❤️ {selectedArtwork.likes.length}
                  </button>

                  <div className="comments-section" onClick={(e) => e.stopPropagation()}>
                      <h4>Comments</h4>
                      <ul className="list-group">
                        {selectedArtwork.comments.map((comment, index) => (
                            <li key={index} className="list-group-item">
                              <strong>{comment.user.name}:</strong> {comment.text}
                            </li>
                        ))}
                      </ul>
                      <div className="mt-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Add a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button 
                          className="btn btn-success mt-2" 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleComment(selectedArtwork._id);
                          }}
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                </div>
              </div>
            )}
        </div>
    );
};

export default Gallery;