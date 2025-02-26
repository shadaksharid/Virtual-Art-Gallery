import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin-login"); 
        } else {
            setAdmin("Admin User"); 
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Welcome to Admin Panel</h2>
            {admin ? <p>Logged in as: {admin}</p> : null}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default AdminDashboard;
