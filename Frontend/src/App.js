import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import '../src/styles/app_style.css'

function App() {
    return (
        <div className="container">
            <center><h1>Welcome to the Virtual Art Gallery</h1></center>

            <div className="links"> 
                <Link to="/login">Login</Link> | 
                <Link to="/register">Register</Link>
            </div>

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            <div className="footer">
                <p>&copy; 2025 Virtual Art Gallery</p>
            </div>
        </div>
    );
}

export default App;

