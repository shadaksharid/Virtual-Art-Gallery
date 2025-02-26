import { useState } from "react";
import API from "../axios";
import "../styles/upload.css"

const UploadArtwork = () => {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!title || !artist || !image){
            alert("All files are required");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("artist", artist);
        formData.append("image", image);
        formData.append("description", description);

        setLoading(true);

        try {
            const res = await API.post("/artworks/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Artwork sent for Approval");
            console.log(res.data);

            setTitle("");
            setArtist("");
            setImage(null);
            setDescription("");
        } catch (error) {
            console.error(error);
            alert("Failed to upload artwork");
        } finally {
            setLoading(false);
        }
    };
    return(
        <div className="upload-container container mt-5">
            <div className="card p-4 mx-auto" style={{ maxWidth: "600px" }}>
            <h2 className="text-center mb-4">Submit Artwork</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control mb-3" required></input>
                <input type="text" placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} className="form-control mb-3" required></input>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="form-control mb-3" required></input>
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control mb-3" rows="4"></textarea>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading? "Submitting..." : "Submit"}
                </button>
            </form>
            </div>
        </div>
    );
};

export default UploadArtwork;