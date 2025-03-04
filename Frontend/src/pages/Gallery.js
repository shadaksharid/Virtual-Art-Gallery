import React, { useEffect, useState, useRef } from "react";
import "../styles/Gallery.css";
import "../styles/app_style.css";
import API from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworksStart, fetchArtworksSuccess, fetchArtworksFailure, likeArtworkSuccess, commentArtworkSuccess } from "../redux/gallerySlice";

const Gallery = () => {
    const dispatch = useDispatch();
    const { artworks, loading, error } = useSelector((state) => state.gallery);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterArtist, setFilterArtist] = useState("");
    const modalOverlayRef = useRef(null); 

    useEffect(() => {
        fetchArtworks();
    }, [searchQuery, filterArtist]);

    const fetchArtworks = async () => {
        dispatch(fetchArtworksStart());
        try {
            const response = await API.get("/artworks", {
                params: {
                    status: "approved",
                    title: searchQuery,
                    artist: filterArtist
                }
            });
            dispatch(fetchArtworksSuccess(response.data));
        } catch (err) {
            console.error("Error fetching artworks");
            dispatch(fetchArtworksFailure("Failed to fetch artworks"));
        }
    };

    const openDetailView = (art) => {
        setSelectedArtwork(art);
        if (modalOverlayRef.current) {
            modalOverlayRef.current.classList.add('active'); 
        }
    };

    const closeDetailView = () => {
        setSelectedArtwork(null);
        setCommentText("");
        if (modalOverlayRef.current) {
            modalOverlayRef.current.classList.remove('active'); 
        }
    };

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

    return (
        <div className="gallery-container container mt-5">
            <h2 className="text-center mb-4">Art Gallery</h2>

            <div className="search-filter-container mb-4">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control mb-2"
                />
                <input
                    type="text"
                    placeholder="Filter by artist..."
                    value={filterArtist}
                    onChange={(e) => setFilterArtist(e.target.value)}
                    className="form-control mb-2"
                />
            </div>

            {loading && <div className="loading-spinner"></div>}
            {error && <p className="text-center text-danger">{error}</p>}
            {!loading && artworks.length === 0 && <p className="text-center">No artworks available.</p>}

            <div className="row">
                {artworks.map((art) => (
                    <div key={art._id} className="col-md-4 mb-4" onClick={() => openDetailView(art)}>
                        <div className="card h-100">
                            <div className="card-image-container">
                                <img src={art.imageUrl} alt={art.title} className="card-img" />
                            </div>
                            <div className="card-body">
                                <h3 className="card-title">{art.title}</h3>
                                <p className="card-artist">By {art.artist}</p>
                                <p className="card-submitted-by">Submitted by: {art.user?.name || "Unknown"}</p>
                                <button
                                    className="btn btn-like"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(art._id);
                                    }}
                                >
                                    ❤️ {art.likes.length}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedArtwork && (
                <div className="modal-overlay" ref={modalOverlayRef} onClick={closeDetailView}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={closeDetailView}>&times;</span>
                        <img src={selectedArtwork.imageUrl} alt={selectedArtwork.title} className="modal-image" />
                        <h2 className="modal-title">{selectedArtwork.title}</h2>
                        <p className="modal-artist"><strong>Artist:</strong> {selectedArtwork.artist}</p>
                        <p className="modal-description"><strong>Description:</strong> {selectedArtwork.description || "No description available."}</p>
                        <button
                            className="btn btn-like"
                            onClick={() => handleLike(selectedArtwork._id)}
                        >
                            ❤️ {selectedArtwork.likes.length}
                        </button>

                        <div className="comments-section">
                            <h4>Comments</h4>
                            <ul className="comments-list">
                                {selectedArtwork.comments.map((comment, index) => (
                                    <li key={index} className="comment-item">
                                        <strong>{comment.user.name}:</strong> {comment.text}
                                    </li>
                                ))}
                            </ul>
                            <div className="comment-input-container">
                                <input
                                    type="text"
                                    className="comment-input"
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <button
                                    className="btn btn-comment"
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