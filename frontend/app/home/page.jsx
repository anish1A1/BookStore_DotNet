'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';

export default function Home() {
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (hasRedirected) return;

    const token = localStorage.getItem('token');
    console.log('Token in home:', token);
    if (!token) {
      setHasRedirected(true);
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token in home:', decoded);
      const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (role === 'Admin') {
        setHasRedirected(true);
        router.push('/admin-home');
      } else if (role === 'Member') {
        setHasRedirected(true);
        router.push('/member-dashboard');
      } else {
        console.error('Unknown role:', role);
        localStorage.removeItem('token');
        setHasRedirected(true);
        router.push('/login');
      }
    } catch (err) {
      console.error('Token decode error in home:', err);
      localStorage.removeItem('token');
      setHasRedirected(true);
      router.push('/login');
    }
  }, [hasRedirected]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Redirecting...</h2>
        <p className="text-center text-dark-blue">Please wait while we redirect you to your dashboard.</p>
      </div>
    </div>
  );
}