"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axios from './axios';

export default function CheckAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if (userRole === "Admin") {
          router.push('/admin/dashboard');
        } else if (userRole === "Staff") {
            router.push('/staff/dashboard');
        } else if (userRole === "Member") {
            router.push('/');
        } else {
            router.push('/login');
        }
      } catch (err) {
        console.error('Invalid token on root route:', err);
        localStorage.removeItem('token');
        router.push('/register');
      }
    } else {
      router.push('/register');
    }
  }, [router]);

  return null;
}