'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axios from '../../utils/axios';

export default function AdminHome() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-blue-200">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Admin Homepage</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <p className="text-center text-dark-blue">Welcome, {user.username}!</p>
        <p className="text-center text-dark-blue">You are logged in as an Admin.</p>
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