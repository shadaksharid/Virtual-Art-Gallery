import React from "react";
import AuthForm from "../components/AuthForm";

const Login = ({onLogin}) => {
    return <AuthForm isLogin={true} onLogin = {onLogin}/>
};
export default Login;