import { createContext, useEffect, useState } from "react";
import API from "../services/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // INIT AUTH ON LOAD
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        } catch (err) {
            console.log("Auth error:", err);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // LOGIN
    const login = (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // 🔥 REFRESH USER (IMPORTANT FOR KARMA UPDATE)
    const refreshUser = async () => {
        try {
            const token = localStorage.getItem("token");

            const { data } = await API.get("/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);

        } catch (err) {
            console.log("Refresh user error:", err);
        }
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login,
            logout,
            refreshUser,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;