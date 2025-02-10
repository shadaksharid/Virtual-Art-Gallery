import React, { useEffect, useState } from "react";
import "../styles/Gallery.css";
import API from "../axios";

// const sampleartwork = [
//     {
//         "id":1,
//         "title":"The Starry Night",
//         "artist":"Vincent Van Gogh",
//         "image":"/images/The-Starry-Night.jpg"
//     },
//     {
//         "id":2,
//         "title":"The Scream",
//         "artist":"Edvard Munch",
//         "image":"/images/The-Scream.jpg"
//     },
//     {
//         "id":3,
//         "title":"Mona Lisa",
//         "artist":"Leonardo da Vinci",
//         "image":"/images/Mona-Lisa.jpg"
//     },
//     {
//         "id":4,
//         "title":"The Persistence of Memory",
//         "artist":"Salvador Dalí",
//         "image":"/images/The-Persistence-of-Memory.jpg"
//     },
//     {
//         "id":5,
//         "title":"Girl with a Pearl Earring",
//         "artist":"Johannes Vermeer",
//         "image":"/images/Girl-with-a-Pearl-Earring.jpg"
//     },
//     {
//         "id":6,
//         "title":"The Creation of Adam",
//         "artist":"Michelangelo",
//         "image":"/images/Creation-of-Adam.jpg"
//     },
//     {
//         "id":7,
//         "title":"The Birth of Venus",
//         "artist":"Sandro Botticelli",
//         "image":"/images/The-Birth-of-Venus.jpg"
//     },
//     {
//         "id":8,
//         "title":"Guernica",
//         "artist":"Pablo Picasso",
//         "image":"/images/PicassoGuernica.jpg"
//     },
//     {
//         "id":9,
//         "title":"The Night Watch",
//         "artist":"Rembrandt",
//         "image":"/images/The-Night-Watch.jpg"
//     },
//     {
//         "id":10,
//         "title":"American Gothic",
//         "artist":"Grant Wood",
//         "image":"/images/American-Gothic.jpg"
//     },
// ];

 const Gallery = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
              const response = await API.get("/artworks"); 
              setArtworks(response.data);
            } catch (err) {
              console.error("Error fetching artworks:", err);
              setError("Failed to fetch artworks.");
            } finally {
              setLoading(false);
            }
          };
      
          fetchArtworks();
    },[]);
    return(
        <div className="gallery-container">
            <h2>Virtual Art Gallery</h2>
            {loading && <p>Loading artworks...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && artworks.length === 0 && <p>No artworks available.</p>}
            <div className="gallery-grid">
                {artworks.map((art) => (
                    <div key={art._id} className="art-card">
                        <img src={art.imageUrl} alt={art.title}/>
                        <h3>{art.title}</h3>
                        <p>By {art.artist}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;