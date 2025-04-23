import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios";
import { toast } from "react-toastify";

const AuthForm = ({ isLogin, onLogin }) => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState("credentials"); 
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (isLogin) {
                if (step === "credentials") {
                    await API.post("users/login", { email: formData.email, password: formData.password });
                    toast.success("OTP sent to email.");
                    setStep("otp"); // Move to OTP verification step
                } else {
                    const res = await API.post("users/verify-login-otp", { email: formData.email, otp });
                    localStorage.setItem("token", res.data.token);
                    toast.success("Login successful");
                    if (onLogin) onLogin();
                    navigate("/gallery");
                }
            } else {
                await API.post("users/register", formData);
                toast.success("Registration successful. Verify OTP to continue.");
                navigate("/verify-otp", { state: { email: formData.email } });
            }
        } catch (err) {
            setError(err.response?.data?.msg || "Something went wrong");
            toast.error("Error: " + (err.response?.data?.msg || "Something went wrong"));
        }
    };

    return (
        <div className="auth-container container mt-3">
            <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
                <h2 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    {step === "credentials" && !isLogin && (
                        <input type="text" name="name" placeholder="Full name" onChange={handleChange} className="form-control mb-3" required />
                    )}
                    {step === "credentials" ? (
                        <>
                            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="form-control mb-3" required />
                            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="form-control mb-3" required />
                        </>
                    ) : (
                        <input type="text" name="otp" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} className="form-control mb-3" required />
                    )}
                    <button type="submit" className="btn btn-primary w-100">{step === "credentials" ? (isLogin ? "Login" : "Signup") : "Verify OTP"}</button>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
