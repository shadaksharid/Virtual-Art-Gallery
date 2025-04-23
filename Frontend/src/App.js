import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/UserProfile";
import "../src/styles/app_style.css";
import Gallery from "./pages/Gallery";
import UploadArtwork from "./components/UploadArtwork";
import { useEffect, useRef, useState } from "react";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./components/Notifications";
import HomeBanner from "./components/HomeBanner";
import { FaUser, FaBell, FaTimes, FaBars } from "react-icons/fa";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import API from "./axios";
import { jwtDecode } from "jwt-decode";
import OtpVerification from "./pages/OtpVerification";
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState("");
    const [navOpen, setNavOpen] = useState(false);
    const [unReadNotifCount, setUnreadNotifCount] = useState(0);
    const navigate = useNavigate();
    const [navVisible, setNavVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if(currentScrollY < 10) {
                setNavVisible(true);
            }
            else if(currentScrollY < lastScrollY.current){
                setNavVisible(true);
            }else if(currentScrollY > lastScrollY.current){
                setNavVisible(false);
                if(navOpen){
                    setNavOpen(true)
                }
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll, {passive: true});
        return window.removeEventListener("scroll", handleScroll);
    },[navOpen]);
    useEffect(() => {
        const userToken = localStorage.getItem("token");
        const adminToken = localStorage.getItem("adminToken");

        if (userToken) {
            const decodedToken = jwtDecode(userToken);
            const expiryTime = decodedToken.exp * 1000;
            const currentTime = Date.now();

            if(currentTime >= expiryTime){
                handleLogout();
            }else{
            setIsAuthenticated(true);
            fetchUserProfile(userToken);
            fetchNotifications(userToken);

            const timeout = setTimeout(handleLogout, expiryTime - currentTime);
            return() => clearTimeout(timeout);
            }
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
                const unreadCount = notifications.filter(notif => !notif.isRead).length;
                setUnreadNotifCount(unreadCount);
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
        setUnreadNotifCount(unReadNotifCount - 1);
    }
    return (
        <>
        <ToastContainer position="top-right" autoClose={3000}/>
        <div className="container mt-3">
            <h1 className="display-4">{isAuthenticated && username ? 
                `Welcome , ${username}` : 
                "Welcome to Virtual Art Gallery"
            }</h1>
            <div className={`nav-wrapper ${navVisible ? 'visible' : 'hidden'}`}>
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
                                {unReadNotifCount > 0 && (
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
                                    {unReadNotifCount}
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
                <Route path="/verify-otp" element = {<OtpVerification />} />
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