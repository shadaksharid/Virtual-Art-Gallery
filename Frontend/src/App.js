import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/UserProfile";
import "../src/styles/app_style.css";
import Gallery from "./pages/Gallery";
import UploadArtwork from "./components/UploadArtwork";
import { useEffect, useState } from "react";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./components/Notifications";
import HomeBanner from "./components/HomeBanner";
import { FaUpload, FaUser, FaBell } from "react-icons/fa";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem("token");
        const adminToken = localStorage.getItem("adminToken");

        if (userToken) {
            setIsAuthenticated(true);
        }
        if (adminToken) {
            setIsAdmin(true);
        }
    }, [isAuthenticated, isAdmin]);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };
    const handleAdminLogin = () => {
        setIsAdmin(true);
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/");
    };

    const handleAdminLogout = () => {
        localStorage.removeItem("adminToken");
        setIsAdmin(false);
        navigate("/admin-login");
    };

    return (
        <div className="container mt-3">
            <h1 className="display-4">Welcome to the Virtual Art Gallery</h1>

            <div className="navbar-container">
                {!isAuthenticated && !isAdmin ? (
                    <>
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                        <Link to="/admin-login" className="nav-link">Admin</Link>
                    </>
                ) : isAuthenticated ? (
                    <>  
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/gallery" className="nav-link">Gallery</Link>
                        <Link to="/upload" className="nav-link">Upload</Link>
                        <Link to="/profile" className="nav-link"><FaUser className="nav-icon" /></Link>
                        <Link to="/notifications" className="nav-link"><FaBell className="nav-icon" /></Link>
                        <button onClick={handleLogout} className="nav-link logout">Logout</button>
                    </>
                ) : isAdmin ? (
                    <>
                        <Link to="/dashboard" className="nav-link">Admin Panel</Link>
                        <button onClick={handleAdminLogout} className="nav-link logout">Logout</button>
                    </>
                ) : null}
            </div>

            <Routes>
                <Route path="/" element={<HomeBanner />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/upload" element={<UploadArtwork />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/admin-login" element={<AdminLogin onLogin={handleAdminLogin} />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
            </Routes>

            <center>
                <div className="footer">
                    <p>&copy; 2025 Virtual Art Gallery</p>
                </div>
            </center>
        </div>
    );
}

export default App;