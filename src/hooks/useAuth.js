// src/hooks/useAuth.js
import { useNavigate } from "react-router-dom";

export default function useAuth() {
    const navigate = useNavigate();

    const logout = () => {
        // remove token
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // redirect login
        navigate("/login");
    };

    const getUser = () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    };

    const isAuthenticated = () => {
        return !!localStorage.getItem("token");
    };

    return {
        logout,
        getUser,
        isAuthenticated
    };
}