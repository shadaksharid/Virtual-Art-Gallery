import React from "react";
import "../styles/banner.css";
import GalleryImage from "../components/homebanner.jpg";
import { useNavigate } from "react-router-dom";

function HomeBanner() {
    const navigate = useNavigate();

    const handleExploreGallery = () => {
        const userToken = localStorage.getItem("token");
        if(userToken){
            navigate("/gallery");
        }else{
            navigate("/login");
        } 
    };

    return (
        <div className="banner">
            <div className="banner-text">
                <h2>Experience the Beauty of Virtual Art</h2>
                <p>Explore and showcase amazing digital artworks</p>
                <button className="explore-btn" onClick={handleExploreGallery}>
                    Explore Gallery
                </button>
            </div>

            <div className="banner-image">
                <img src={GalleryImage} alt="Virtual Art Gallery" />
            </div>
        </div>
    );
}


export default HomeBanner;
