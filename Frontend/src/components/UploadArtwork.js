import { useState } from "react";
//import { uploadArtwork } from "../axios";
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

            alert("Artwork uploaded successfully");
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
        <div className="upload-container">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required></input>
                <input type="text" placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} required></input>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required></input>
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <button type="submit" disabled={loading}>
                    {loading? "Uploading..." : "upload"}
                </button>
            </form>
        </div>
    );
};

export default UploadArtwork;