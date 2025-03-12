import React,{useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile,fetchUserLikedArtworks, fetchUserComments, fetchUserUploadedArtworks } from "../redux/userSlice";
import "../styles/profile.css";

const Profile = () => {
    const dispatch = useDispatch();
    const {user, likedArtworks,uploadedArtworks, comments,status, error} = useSelector((state) => state.user);

    const [bio, setBio] = useState("");
    const [gender, setGender] = useState("");

    useEffect(() => {
        dispatch(fetchUserProfile());
        dispatch(fetchUserLikedArtworks());
        dispatch(fetchUserComments());
        dispatch(fetchUserUploadedArtworks());
    }, [dispatch]);

    useEffect(() => {
        if(user){
            setBio(user.bio || "");
            setGender(user.gender || "");
        }
    },[user]);

    const handleUpdateProfile = () => {
        dispatch(updateUserProfile({bio, gender}));
    };

    if (status === "loading") return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
  
    return (
      <div className="profile-container container mt-5">
        <div className="card p-4 mx-auto">
        <h2 className="text-center mb-4">My Profile</h2>
        <p className="form-control mb-3"><strong>Name:</strong> {user?.name}</p>
        <p className="form-control mb-3"><strong>Email:</strong> {user?.email}</p>
  
          <label>Bio:</label>
          <textarea
            className="form-control mb-3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
  
          <label>Gender:</label>
          <select
            className="form-control mb-3"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
  
          <button onClick={handleUpdateProfile} className="btn btn-primary w-100">
            Update Profile
          </button>
                <h3 className="mt-4">Liked Artworks</h3>
                <div className="row">
                    {likedArtworks.length > 0 ? (
                        likedArtworks.map((art) => (
                            <div key={art._id} className="col-6 col-sm-6 col-md-4 col-lg-3">
                                <div className="card h-100">
                                    <img src={art.imageUrl} alt={art.title} className="card-img-top img-fluid"/>
                                    <div className="card-body">
                                        <h5 className="card-title">{art.title}</h5>
                                        <p className="card-text">By {art.artist}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No liked artworks.</p>
                    )}
                </div>
                <h3 className="mt-4">Uploaded Artworks</h3>
                <div className="row">
                    {uploadedArtworks.length > 0 ? (
                        uploadedArtworks.map((art) => (
                            <div key={art._id} className="col-6 col-sm-6 col-md-4 col-lg-3">
                                <div className="card h-100">
                                    <img src={art.imageUrl} alt={art.title} className="card-img-top img-fluid" />
                                    <div className="card-body">
                                        <h5 className="card-title">{art.title}</h5>
                                        <p className="card-text">By {art.artist}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No uploaded artworks.</p>
                    )}
                </div>
                <h3 className="mt-4">My Comments</h3>
                {comments.length > 0 ? (
                    comments.map((commentData, index) => (
                        <div key={index} className="comment-section p-3 mb-2 border">
                            <h5>{commentData.artworkTitle}</h5>
                            {commentData.comments.map((comment, idx) => (
                                <p key={idx}>"{comment.text}"</p>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>No comments yet.</p>
                )}
        </div>
      </div>
    );
}

  
export default Profile;