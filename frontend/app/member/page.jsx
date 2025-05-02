'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

export default function MemberDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

      if (role !== 'Member') {
        router.push('/home');
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
            router.push('/login');
          }
        });
    } catch (err) {
      console.error('Token decode error:', err);
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-blue-200">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Member Dashboard</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <p className="text-center text-dark-blue">Welcome, {user.username}!</p>
        <p className="text-center text-dark-blue">You are logged in as a Member.</p>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}
          className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}