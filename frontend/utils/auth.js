"use client"

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setError] = useState({});

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

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get(`/api/auth/dashboard/`);
            setUser(response.data.user);

        } catch (error) {
            
            console.error("Error fetching user data:", error); 
        }finally {
            setLoading(false);
        }
    };

    const login = async (credentials, router) => {
        e.preventDefault();
        try {
          const res = await axios.post('/api/auth/login',credentials);
          localStorage.setItem('token', res.data.token);
          router.push('/home');
        } catch (err) {
          setError(err.response?.data?.Message || 'Login failed');
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
            console.error("Error logging out:", error);
        } finally {
            setLoading(false);
        }
      }

      const authContextValue = useMemo(() => ({
        user,
        loading,
        errors,
        login,
        logout
      }), [user, loading, errors]);
      
      return (
        <AuthContext.Provider value={authContextValue}>
          {children}
        </AuthContext.Provider>
      );
}

export {AuthContext};