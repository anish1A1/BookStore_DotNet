// app/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Validate the token by decoding it
        jwtDecode(token);
        // If decoding succeeds, redirect to /home
        router.push('/home');
      } catch (err) {
        // If token is invalid, clear it and redirect to /register
        console.error('Invalid token on root route:', err);
        localStorage.removeItem('token');
        router.push('/register');
      }
    } else {
      // No token, redirect to /register
      router.push('/register');
    }
  }, [router]);

  return null;
}