import { useState } from "react";
import API from "../axios";
import "../styles/upload.css";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

const UploadArtwork = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeArtworkIndex, setActiveArtworkIndex] = useState(0);

    const handleFilesChange = (e) => {
        const files = Array.from(e.target.files);
        const newArtworks = files.map((file) => ({
            title: "",
            artist: "",
            description: "",
            image: file,
        }));
        setArtworks([...artworks, ...newArtworks]);

        if (artworks.length === 0 && files.length > 0) {
            setActiveArtworkIndex(0);
        }
    };

    const handleInputChange = (index, field, value) => {
        const updatedArtworks = [...artworks];
        updatedArtworks[index][field] = value;
        setArtworks(updatedArtworks);
    };

    const handleRemove = (index) => {
        const updatedArtworks = artworks.filter((_, i) => i !== index);
        setArtworks(updatedArtworks);

        if (index === activeArtworkIndex) {
            setActiveArtworkIndex(Math.min(activeArtworkIndex, updatedArtworks.length - 1));
        } else if (index < activeArtworkIndex) {
            setActiveArtworkIndex(activeArtworkIndex - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (artworks.length === 0) {
            toast.warning("Please upload at least one artwork.");
            return;
        }

        setLoading(true);

        try {
            for (let art of artworks) {
                if (!art.title || !art.artist || !art.image) {
                    toast.warning("All fields are required for each artwork");
                    setLoading(false);
                    return;
                }

                const formData = new FormData();
                formData.append("title", art.title);
                formData.append("artist", art.artist);
                formData.append("description", art.description);
                formData.append("image", art.image);

                await API.post("/artworks/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                });
            }

            toast.success("Artworks sent for approval");
            setArtworks([]);
            setActiveArtworkIndex(0);
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload artworks");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container container mt-5">
            <div className="card p-4 mx-auto" style={{ maxWidth: "800px" }}>
                <h2 className="text-center mb-4">Submit Multiple Artworks</h2>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="form-control mb-3"
                    onChange={handleFilesChange}
                />

 
                <div className="d-flex flex-wrap gap-3 mb-4">
                    {artworks.map((art, index) => (
                        <div 
                            key={index} 
                            className={`image-preview-wrapper position-relative ${index === activeArtworkIndex ? 'active' : ''}`}
                            onClick={() => setActiveArtworkIndex(index)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="position-absolute top-0 end-0">
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm p-1 rounded-circle"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(index);
                                    }}
                                    style={{ transform: "translate(30%, -30%)" }}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <img
                                src={URL.createObjectURL(art.image)}
                                alt="Preview"
                                className="img-thumbnail"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    border: index === activeArtworkIndex ? "3px solidrgb(168, 202, 253)" : ""
                                }}
                            />
                        </div>
                    ))}
                </div>

                {artworks.length > 0 && (
                    <div className="artwork-item mb-4 p-3 border rounded">
                        <h6>Artwork {activeArtworkIndex + 1} of {artworks.length}</h6>
                        <input
                            type="text"
                            placeholder="Title"
                            value={artworks[activeArtworkIndex].title}
                            onChange={(e) => handleInputChange(activeArtworkIndex, "title", e.target.value)}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Artist"
                            value={artworks[activeArtworkIndex].artist}
                            onChange={(e) => handleInputChange(activeArtworkIndex, "artist", e.target.value)}
                            className="form-control mb-2"
                        />
                        <textarea
                            placeholder="Description"
                            value={artworks[activeArtworkIndex].description}
                            onChange={(e) => handleInputChange(activeArtworkIndex, "description", e.target.value)}
                            className="form-control mb-2"
                        ></textarea>
                    </div>
                )}

                {artworks.length > 0 && (
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit All"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default UploadArtwork;