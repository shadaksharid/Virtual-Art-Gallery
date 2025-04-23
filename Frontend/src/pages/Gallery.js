import React, { useEffect, useState, useRef } from "react";
import "../styles/Gallery.css";
import "../styles/app_style.css";
import API from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworksStart, fetchArtworksSuccess, fetchArtworksFailure, likeArtworkSuccess, commentArtworkSuccess } from "../redux/gallerySlice";
import { FaChevronLeft, FaChevronRight, FaHeart, FaSearch, FaTimes } from "react-icons/fa";

const Gallery = () => {
    const dispatch = useDispatch();
    const { artworks, loading, error } = useSelector((state) => state.gallery);
    const [selectedArtworks, setSelectedArtworks] = useState([]);
    const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterArtist, setFilterArtist] = useState("");
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
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

    const openDetailView = (art, index) => {
        setSelectedArtworks(artworks);
        setCurrentArtworkIndex(index);
        if (modalOverlayRef.current) {
            modalOverlayRef.current.classList.add('active');
        }
    };

    const closeDetailView = () => {
        setSelectedArtworks([]);
        setCurrentArtworkIndex(0);
        setCommentText("");
        if (modalOverlayRef.current) {
            modalOverlayRef.current.classList.remove('active');
        }
    };

    const navigateArtwork = (direction) => {
        const newIndex = direction === 'next' 
            ? (currentArtworkIndex + 1) % selectedArtworks.length
            : (currentArtworkIndex - 1 + selectedArtworks.length) % selectedArtworks.length;
        setCurrentArtworkIndex(newIndex);
    };

    const handleLike = async (artworkId) => {
        try {
            const response = await API.post(`/artworks/${artworkId}/like`);
            dispatch(likeArtworkSuccess(response.data.artwork));
            const updatedArtworks = artworks.map(art => 
                art._id === response.data.artwork._id ? response.data.artwork : art
            );
            dispatch(fetchArtworksSuccess(updatedArtworks));
            setSelectedArtworks(updatedArtworks);
        } catch (err) {
            console.error("Error liking artwork", err);
        }
    };

    const handleComment = async (artworkId) => {
        if (!commentText.trim()) return;
        try {
            const response = await API.post(`/artworks/${artworkId}/comment`, { text: commentText });
            dispatch(commentArtworkSuccess(response.data.artwork));
            const updatedArtworks = artworks.map(art => 
                art._id === response.data.artwork._id ? response.data.artwork : art
            );
            dispatch(fetchArtworksSuccess(updatedArtworks));
            setSelectedArtworks(updatedArtworks);
            setCommentText("");
        } catch (err) {
            console.error("Error adding comment", err);
        }
    };

    const handleReply = async(artworkId, commentId) => {
        if(!replyText.trim()) return;
        try{
            const response = await API.post(`/artworks/${artworkId}/comment/${commentId}/reply`, {text: replyText});
            dispatch(commentArtworkSuccess(response.data.artwork));
            const updatedArtworks = artworks.map(art => 
                art._id === response.data.artwork._id ? response.data.artwork : art
            );
            dispatch(fetchArtworksSuccess(updatedArtworks));
            setSelectedArtworks(updatedArtworks);
            setReplyText("");
            setReplyingTo(null);
        }catch(err){
            console.error("Error adding reply", err);
        }
    }

    const currentArtwork = selectedArtworks[currentArtworkIndex];

    return (
        <div className="gallery-container container mt-5">
            <div className="gallery-header">
                <h2>Art Gallery</h2>
                <button 
                    className="search-icon" 
                    onClick={() => setShowSearch(!showSearch)}
                >
                    <FaSearch />
                </button>
            </div>

            <div className={`search-filter-container mb-4 ${!showSearch ? 'hidden' : ''}`}>
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

            <div className="gallery-grid">
                {artworks.map((art, index) => (
                    <div key={art._id} className="gallery-card" onClick={() => openDetailView(art, index)}>
                        <img src={art.imageUrl} alt={art.title} className="gallery-thumbnail"/>
                        <div className="gallery-card-body">
                            <h3 className="gallery-title">{art.title}</h3>
                            <p className="gallery-artist">By {art.artist}</p>
                            <p className="submitted-by">Submitted By {art.user?.name}</p>
                            <div className="gallery-stats">
                                <span className="likes-count">
                                    <FaHeart /> {art.likes.length}
                                </span>
                                <span className="comments-count">
                                    💬 {art.comments.length}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedArtworks.length > 0 && currentArtwork && (
                <div className="modal-overlay" ref={modalOverlayRef} onClick={closeDetailView}>
                    <div className="artwork-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeDetailView}>
                            <FaTimes />
                        </button>
                        
                        <div className="artwork-modal-content">
                            <div className="artwork-image-container">
                                <img 
                                    src={currentArtwork.imageUrl} 
                                    alt={currentArtwork.title} 
                                    className="modal-artwork-image"
                                />
                                <div className="artwork-navigation">
                                    <button 
                                        className="nav-button prev-button"
                                        onClick={() => navigateArtwork('prev')}
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <span className="artwork-counter">
                                        {currentArtworkIndex + 1} / {selectedArtworks.length}
                                    </span>
                                    <button 
                                        className="nav-button next-button"
                                        onClick={() => navigateArtwork('next')}
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>
                            </div>

                            <div className="artwork-details-comments">
                                <div className="artwork-meta">
                                    <h2 className="artwork-title">{currentArtwork.title}</h2>
                                    <p className="artwork-artist">By {currentArtwork.artist}</p>
                                    <p className="artwork-description">
                                        {currentArtwork.description || "No description available."}
                                    </p>
                                    <button
                                        className="like-button"
                                        onClick={() => handleLike(currentArtwork._id)}
                                    >
                                        <FaHeart /> {currentArtwork.likes.length}
                                    </button>
                                </div>

                                <div className="comments-section">
                                    <h3 className="comments-header">Comments ({currentArtwork.comments.length})</h3>
                                    
                                    <div className="comments-list">
                                        {currentArtwork.comments.length > 0 ? (
                                            currentArtwork.comments.map((comment) => (
                                                <div key={comment._id} className="comment-item">
                                                    <div className="comment-header">
                                                        <strong className="comment-author">{comment.user.name}</strong>
                                                    </div>
                                                    <p className="comment-text">{comment.text}</p>
                                                    
                                                    <button
                                                        className="reply-button"
                                                        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                                    >
                                                        Reply
                                                    </button>

                                                    {replyingTo === comment._id && (
                                                        <div className="reply-form">
                                                            <input
                                                                type="text"
                                                                placeholder="Write your reply..."
                                                                value={replyText}
                                                                onChange={(e) => setReplyText(e.target.value)}
                                                            />
                                                            <button
                                                                className="submit-reply"
                                                                onClick={() => handleReply(currentArtwork._id, comment._id)}
                                                            >
                                                                Post
                                                            </button>
                                                        </div>
                                                    )}

                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <div className="replies-container">
                                                            {comment.replies.map((reply) => (
                                                                <div key={reply._id} className="reply-item">
                                                                    <div className="reply-header">
                                                                        <strong className="reply-author">
                                                                            ↳ {reply.user?.name}
                                                                        </strong>
                                                                    </div>
                                                                    <p className="reply-text">{reply.text}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-comments">No comments yet. Be the first to comment!</p>
                                        )}
                                    </div>

                                    <div className="comment-form">
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                        />
                                        <button
                                            className="submit-comment"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleComment(currentArtwork._id);
                                            }}
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;