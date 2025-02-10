import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import '../src/styles/app_style.css';
import Gallery from "./pages/Gallery";
import UploadArtwork from "./components/UploadArtwork";

function App() {
    return (
        <div className="container">
            <center><h1>Welcome to the Virtual Art Gallery</h1></center>

            <div className="links"> 
                <Link to="/">Home</Link> |
                <Link to="/login">Login</Link> |
                <Link to="/register">Register</Link> 
            </div>

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>

            <Routes>
                <Route path="/gallery" element={<Gallery />}/>
            </Routes>
            <Routes>
                <Route path="/upload" element={<UploadArtwork />} />
            </Routes>
            <div className="footer">
                <p>&copy; 2025 Virtual Art Gallery</p>
            </div>
        </div>
    );
}

export default App;

