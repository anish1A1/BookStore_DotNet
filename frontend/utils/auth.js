"use client"

import { useEffect, useMemo, createContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axios from './axios';
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setError] = useState({});
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await fetchUserData(token);
            } else {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const checkUserRole = (token, router) => {
        try {
            const decoded = jwtDecode(token);
            const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            
            setRole(userRole); // ✅ Update role state
    
            // Redirect based on role
            if (userRole === "Admin") {
                router.push("/admin-dashboard");
            } else if (userRole === "Staff") {
                router.push("/staff-dashboard");
            } else if (userRole === "Member") {
                router.push("/profile");
            } else {
                router.push("/login"); // Fallback case
            }
        } catch (error) {
            console.error("Error checking user role:", error);
            router.push("/login");
        }
    };

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get(`/member-dashboard/`);
            setUser(response.data.user);

        } catch (error) {
            
            console.error("Error fetching user data:", error); 
        }finally {
            setLoading(false);
        }
    };

    const login = async (credentials, router) => {
        try {
          const res = await axios.post('/auth/login',credentials);
          localStorage.setItem('token', res.data.token);
          checkUserRole(token, router);  // This will check the role
          
          return { status: 'success', message: "You have been logged in successfully"}
        
        } catch (err) {
            const errorMessgae = err.response?.data?.Message || 'Login failed';
            console.log(errorMessgae);
            console.log(err);
            throw err.response?.data;
        } finally {
          setLoading(false);
        }
      };

      const logout = async (router) => {
        try {
            localStorage.removeItem('token');
            router.push('/login');
            setUser(null);
        } catch (error) {
            const errorMessgae = err.response?.data?.Message || 'Logout failed';
            console.log(errorMessgae);
            throw err.response?.data;
        } finally {
            setLoading(false);
        }
      }

      const authContextValue = useMemo(() => ({
        user,
        loading,    
        errors,
        role,
        login,
        logout,

      // eslint-disable-next-line react-hooks/exhaustive-deps
      }), [user, loading, errors, role]);
      
      return (
        <AuthContext.Provider value={authContextValue}>
          {children}
        </AuthContext.Provider>
      );
}

export {AuthContext};