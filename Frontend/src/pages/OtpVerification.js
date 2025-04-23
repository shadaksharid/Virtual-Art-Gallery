import React,{useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../axios";
import { toast } from "react-toastify";

const OtpVerification = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try{
            await API.post("users/verify-otp", {email, otp});
            toast.success("Account verified Login now");
            navigate("/login");
        }catch (err) {
            setError(err.response?.data?.msg || "Invalid OTP");
            toast.error("Invalid OTP or expired.");
        }
    }
    return(
            <div className="auth-container container mt-3">
                <   div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
                    <h2 className="text-center mb-4">Verify OTP</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="otp" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} className="form-control mb-3" required />
                    <button type="submit" className="btn btn-primary w-100">Verify</button>
                </form>
            </div>
        </div>
    )
}

export default OtpVerification;