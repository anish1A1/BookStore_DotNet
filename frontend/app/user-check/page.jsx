'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import AdminDashboardPage from '../admin/dashboard/page';

export default function AdminHome() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (hasRedirected) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setHasRedirected(true);
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

      if (role !== 'Admin') {
        setHasRedirected(true);
        router.push('/profile');
        return;
      }

      axios.get(`http://localhost:5189/user/getuserbyid/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setUser(res.data))
        .catch(err => {
          console.error('User fetch error:', err.response || err);
          setError('Failed to fetch user data');
          if (err.response?.status === 401 || err.response?.status === 403) {
            localStorage.removeItem('token');
            setHasRedirected(true);
            router.push('/login');
          }
        });
    } catch (err) {
      console.error('Token decode error:', err);
      localStorage.removeItem('token');
      setHasRedirected(true);
      router.push('/login');
    }
  }, [hasRedirected]);

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-blue-200">Loading...</div>;

  return (
    <AdminDashboardPage />
  );
}