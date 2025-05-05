// app/login/page.jsx
"use client";
import { toast } from "sonner";
import Link from "next/link";

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from "../../../utils/auth";
export default function LoginPage() {
  const {login} = useContext(AuthContext);
  const [credentials, setCredentials]  = useState({username: '', password: ''});
  const router = useRouter();


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(credentials, router);
      if (response) {
        router.push('/home');
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left panel */}
        <div className="w-1/2 bg-[#2C3F51] flex flex-col items-center justify-center p-8 rounded-l-lg rounded-tr-full rounded-br-full">
          <h2 className="text-3xl font-semibold text-white">New here?</h2>
          <p className="text-white text-center mt-4">Create an account.</p>
          <Link
            href="/register"
            className="mt-6 inline-block px-6 py-2 border border-white text-white rounded hover:bg-white hover:text-[#2C3F51] transition"
          >
            SIGN UP
          </Link>
        </div>

        {/* Right panel */}
        <div className="w-1/2 p-8">
          {/* Logo */}
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              <span className="text-[#2C3F51]">Book</span>
              <span className="text-gray-800">_Lux</span>
            </h1>
            <p className="text-xs uppercase text-gray-500 tracking-widest mt-1">
              Express Books
            </p>
          </div>

          {/* Sign In Form */}
          <h2 className="text-2xl text-[#2C3F51] font-semibold mt-6">
            Log In
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                placeholder="James"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C3F51]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C3F51]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2C3F51] text-white py-2 rounded hover:bg-[#012148] transition"
            >
              SIGN IN
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-4">
            Forgot your password?{" "}
            <Link href="/forgot-password" className="text-[#2C3F51] hover:underline">
              Reset it
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
