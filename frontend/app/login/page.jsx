'use client'; 

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5189/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      router.push('/home');
    } catch (err) {
      setError(err.response?.data?.Message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">BookLux Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-dark-blue mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-border rounded-lg focus:outline-none focus:border-gold"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-dark-blue mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-border rounded-lg focus:outline-none focus:border-gold"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-950 text-white py-2 rounded-lg hover:bg-green-950 cursor-pointer"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-dark-blue">
          Don’t have an account?{' '}
          <a href="/register" className="text-gold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}