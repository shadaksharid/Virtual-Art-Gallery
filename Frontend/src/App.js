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
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login");
    };

    const handleAdminLogout = () => {
        localStorage.removeItem("adminToken");
        setIsAdmin(false);
        navigate("/admin-login");
    };

    return (
        <div className="container mt-3">
            <center>
                <h1 className="display-4 mb-4">Welcome to the Virtual Art Gallery</h1>
            </center>

            <div className="d-flex justify-content-center mb-4">
                <Link to="/" className="btn btn-outline-primary mx-2">
                    Home
                </Link>{" "}
                |
                {!isAuthenticated && !isAdmin ? (
                    <>
                        <Link to="/login" className="btn btn-outline-primary mx-2">
                            Login
                        </Link>{" "}
                        |
                        <Link to="/register" className="btn btn-outline-primary mx-2">
                            Register
                        </Link>{" "}
                        |
                        <Link to="/admin-login" className="btn btn-outline-dark mx-2">
                            Admin Login
                        </Link>
                    </>
                ) : isAuthenticated ? (
                    <>
                        <Link to="/gallery" className="btn btn-outline-primary mx-2">
                            Gallery
                        </Link>{" "}
                        |
                        <Link to="/upload" className="btn btn-outline-primary mx-2">
                            Upload
                        </Link>{" "}
                        |
                        <Link to="/profile" className="btn btn-outline-primary mx-2">
                            Profile
                        </Link>{" "}
                        |
                        <button onClick={handleLogout} className="btn btn-outline-danger mx-2">
                            Logout
                        </button>
                    </>
                ) : isAdmin ? (
                    <>
                        <Link to="/dashboard" className="btn btn-outline-primary mx-2">
                            Admin Panel
                        </Link>{" "}
                        |
                        <button onClick={handleAdminLogout} className="btn btn-outline-danger mx-2">
                            Logout
                        </button>
                    </>
                ) : null}
            </div>

            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/upload" element={<UploadArtwork />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="/admin-login" element={<AdminLogin />} />
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
