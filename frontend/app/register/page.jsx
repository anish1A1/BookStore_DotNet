'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:5189/auth/register', {
        username,
        email,
        password,
        confirmPassword
      });
      router.push('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors); // Store all validation errors
      } else {
        setError({ General: ['Registration failed'] });
      }
    }  
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl text-center font-bold text-blue-900 mb-6">BookLux Register</h2>
        {error && Object.keys(error).map((key) => (
            <p key={key} style={{ color: 'red', marginBottom: '10px' }}>
              Error: {error[key].join(', ')}
            </p>
          ))}
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
          <div className="mb-4">
            <label className="block text-dark-blue mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-border rounded-lg focus:outline-none focus:border-gold"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-dark-blue mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-border rounded-lg focus:outline-none focus:border-gold"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-dark-blue mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-border rounded-lg focus:outline-none focus:border-gold"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-950 text-white py-2 rounded-lg hover:bg-green-950 transition cursor-pointer"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-dark-blue">
          Already have an account?{' '}
          <a href="/login" className="text-gold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}