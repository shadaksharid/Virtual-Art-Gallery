import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token); 

        if (!token) {
            console.error("No token found");
            return;
        }
            try {
                const res = await fetch("http://localhost:5000/api/users/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
    
                const data = await res.json();
                console.log("Profile Data:", data); 
    
                if (!res.ok) {
                    throw new Error(data.msg || "Error fetching profile");
                }
    
                setUser(data); 
            } catch (err) {
                console.error(" Profile fetch error:", err.response ? err.response.data : err.message);
            }
        };

        fetchProfile();
    }, []);

    if (!user) {
        return <div className="container mt-4">Loading Profile...</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-3">User Profile</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card p-4">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Bio:</strong> {user.bio || "No bio available"}</p>
                <p><strong>Gender:</strong> {user.gender || "Not specified"}</p>
            </div>
        </div>
    );
};

export default Profile;
