import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios";
import "../styles/auth.css";

const AuthForm = ({ isLogin }) => {
    const [formData, setFormData] = useState({name:"", email:"", password:""});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handlechange = (e) => {
        setFormData({...formData, [e.target.name] : e.target.value});
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        try{
            if(isLogin){
                const res = await API.post("api/users/login",{email : formData.email, password: formData.password});
                localStorage.setItem("token", res.data.token);
                alert("Login successfull");
                navigate("/gallery")
            }else{
                await API.post("api/users/signup", formData);
                alert("Registration successfull");
                navigate("/login")
            }
        }catch(err){
            setError(err.response?.data?.message || "Something went wrong")
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? "Login" : "Register" }</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handlesubmit}>
                {!isLogin && <input type="text" name="name" placeholder="Full name" onChange={handlechange} required />}
                <input type="email" name="email" placeholder="Email" onChange={handlechange} required/>
                <input type="password" name="password" placeholder="Password" onChange={handlechange} required />
                <button type="submit">{isLogin ? "Login" : "Signup"}</button>
            </form>
            <p>
                {isLogin? "Don't have an account?" : "Already have an account?"}{" "}
                <a href={isLogin? "/register": "/login"}>{isLogin? "Register" : "Login"}</a>
            </p>
        </div>
    );
};

export default AuthForm;
