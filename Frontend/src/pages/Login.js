import React from "react";
import AuthForm from "../components/AuthForm";

const Login = (setIsAuthenticated) => {
    return <AuthForm isLogin={true} setIsAuthenticated={setIsAuthenticated}/>
};
export default Login;