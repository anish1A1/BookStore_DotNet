"use client";

import { useEffect, useMemo, createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from './axios';
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setError] = useState({});
    const [role, setRole] = useState(null);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const checkUserRole = (token) => {
        try {
            const decoded = jwtDecode(token);
            const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            setRole(userRole);

        } catch (error) {
            console.error("Error checking user role:", error);
        }
    };

    const login = async (credentials, router) => {
        try {
            const res = await axios.post('/auth/login', credentials);
            localStorage.setItem('token', res.data.token);
            const token = localStorage.getItem('token');
            await fetchUserData(token);
            const decoded = jwtDecode(token);
            const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            setRole(userRole);

            if (userRole === "Admin") {
                router.push("/admin/dashboard");
            } else if (userRole === "Staff") {
                router.push("/staff");
            } else if (userRole === "Member") {
                router.push("/profile");
            } else {
                router.push("/login");
            }
            return { status: 'success', message: "You have been logged in successfully" };
        } catch (err) {
            const errorMessage = err.response?.data?.Message || 'Login failed';
            console.log('Login error details:', err.response?.data);
            throw err.response?.data;
        } finally {
            setLoading(false);
        }
    };

    const logout = async (router) => {
        try {
            localStorage.removeItem('token');
            setUser(null);
            setRole(null);
            router.push('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Logout failed';
            console.log(errorMessage);
            throw error.response?.data;
        } finally {
            setLoading(false);
        }
    };

    const authContextValue = useMemo(() => ({
        user,
        loading,
        setUser,
        errors,
        role,
        login,
        logout,
        fetchUserData,
        checkUserRole,
    }), [user, loading, errors, role]);

    return (
        <AuthContext.Provider value={authContextValue}>
          {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };