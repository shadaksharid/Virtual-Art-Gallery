import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import '../src/styles/app_style.css';
import Gallery from "./pages/Gallery";
import UploadArtwork from "./components/UploadArtwork";
import { useEffect, useState } from "react";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    },[]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login");
    }
    return (
        <div className="container">
            <center><h1>Welcome to the Virtual Art Gallery</h1></center>

            <div className="links"> 
            <Link to="/" className="nav-button">Home</Link> |
            {!isAuthenticated && (
                    <>
                        <Link to="/login" className="nav-button">Login</Link> |
                        <Link to="/register" className="nav-button">Register</Link>
                    </>
                )}
            {isAuthenticated && (
                <>
                        <Link to="/gallery" className="nav-button">Gallery</Link> |
                        <Link to="/upload" className="nav-button">Upload</Link> |
                        <button onClick={handleLogout} className="nav-button logout-button">Logout</button>
                </>
            )}
            </div>

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/gallery" element={ <Gallery /> }/>
                <Route path="/upload" element={ <UploadArtwork /> } />
            </Routes>
            <div className="footer">
                <p>&copy; 2025 Virtual Art Gallery</p>
            </div>
        </div>
    );
}

export default App;

