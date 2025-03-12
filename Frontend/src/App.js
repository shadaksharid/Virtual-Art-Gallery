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
import { FaUser, FaBell, FaTimes, FaBars } from "react-icons/fa";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import API from "./axios";
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState("");
    const [navOpen, setNavOpen] = useState(false);
    const [hasUnreadNotif, setHasUnreadNotif] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem("token");
        const adminToken = localStorage.getItem("adminToken");

        if (userToken) {
            setIsAuthenticated(true);
            fetchUserProfile(userToken);
            fetchNotifications(userToken);
        }
        if (adminToken) {
            setIsAdmin(true);
        }
    }, [isAuthenticated, isAdmin]);

    const fetchUserProfile = async (token) => {
        try{
            const response = await API.get("/users/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if(response.status == 200){
                const userData = response.data;
                setUsername(userData.name);
            }
        }catch(error){
            console.error("error fetching user profile", error);
        }
    }

    const fetchNotifications = async (token) => {
        try{
            const response = await API.get("/notifications", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if(response.status == 200){
                const notifications = response.data;
                const unreadNotifications = notifications.some(
                    (notification) => !notification.isRead
                );
                setHasUnreadNotif(unreadNotifications);
            }
        }catch(error){
            console.error("error fetching notifications", error);
        }
    }
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

    const toggleNav = () => {
        setNavOpen(!navOpen)
    }

    const closeNav = () => {
        setNavOpen(false);
    }
    const handleNotifications = () => {
        setHasUnreadNotif(false);
    }
    return (
        <>
        <ToastContainer position="top-right" autoClose={3000}/>
        <div className="container mt-3">
            <h1 className="display-4">{isAuthenticated && username ? 
                `Welcome back , ${username}` : 
                "Welcome to Virtual Art Gallery"
            }</h1>

            <div className="hamburger-menu" onClick={toggleNav}>
                {navOpen ? <FaTimes /> : <FaBars />}
            </div>
            <div className={`navbar-container ${navOpen ? 'nav-open' : ''}`}>
                {!isAuthenticated && !isAdmin ? (
                    <>
                        <Link to="/" className="nav-link" onClick={closeNav}>Home</Link>
                        <Link to="/login" className="nav-link" onClick={closeNav}>Login</Link>
                        <Link to="/register" className="nav-link" onClick={closeNav}>Register</Link>
                        <Link to="/admin-login" className="nav-link" onClick={closeNav}>Admin</Link>
                    </>
                ) : isAuthenticated ? (
                    <>  
                        <Link to="/" className="nav-link" onClick={closeNav}>Home</Link>
                        <Link to="/gallery" className="nav-link" onClick={closeNav}>Gallery</Link>
                        <Link to="/upload" className="nav-link" onClick={closeNav}>Upload</Link>
                        <Link to="/profile" className="nav-link" onClick={closeNav}><FaUser className="nav-icon" /></Link>
                        <Link to="/notifications" className="nav-link" onClick={closeNav}>
                            <div style={{position: "relative"}}>
                                <FaBell className="nav-icon" />
                                {hasUnreadNotif && (
                                    <span
                                    style={{
                                        position: "absolute",
                                        top: "-5px",
                                        right: "-5px",
                                        backgroundColor: "red",
                                        color: "white",
                                        borderRadius: "50%",
                                        padding: "2px 6px",
                                        fontSize: "12px",
                                    }}
                                >
                                    !
                                </span>
                                )}
                            </div>
                        </Link>
                        <button onClick={() => {handleLogout(); closeNav();}} className="nav-link logout">Logout</button>
                    </>
                ) : isAdmin ? (
                    <>
                        <Link to="/dashboard" className="nav-link" onClick={closeNav}>Admin Panel</Link>
                        <button onClick={() => {handleAdminLogout(); closeNav();}} className="nav-link logout">Logout</button>
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
                <Route path="/notifications" element={<Notifications onMarkAsRead={handleNotifications}/>} />
                <Route path="/admin-login" element={<AdminLogin onLogin={handleAdminLogin} />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
            </Routes>

            <center>
                <div className="footer">
                    <p>&copy; 2025 Virtual Art Gallery</p>
                </div>
            </center>
        </div>
        </>
    );
}

export default App;