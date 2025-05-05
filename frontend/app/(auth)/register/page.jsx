// app/signup/page.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left panel */}
        <div className="w-1/2 bg-[#2C3F51] flex flex-col items-center justify-center p-8 rounded-l-lg rounded-tr-full rounded-br-full">
          <h2 className="text-3xl font-semibold text-white">Existing user?</h2>
          <p className="text-white text-center mt-4">Enter your login details.</p>
          <Link
            href="/login"
            className="mt-6 inline-block px-6 py-2 border border-white text-white rounded hover:bg-white hover:text-[#2C3F51] transition"
          >
            SIGN IN
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
            <p className="text-xs uppercase text-[#2C3F51] tracking-widest mt-1">
              Express Books
            </p>
          </div>

          {/* Sign Up Form */}
          <h2 className="text-2xl font-semibold mt-6">Create Account</h2>
          <form
            action="/api/signup"
            method="POST"
            encType="multipart/form-data"
            className="mt-4 space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C3F51]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="shresthajames21@gmail.com"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C3F51]"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
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
                placeholder="Enter your password"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C3F51]"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C3F51]"
              />
            </div>

            {/* Avatar picker */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-2">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <svg
                    className="w-full h-full text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                )}
              </div>
              <label
                htmlFor="avatar"
                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded transition"
              >
                {avatarPreview ? "Change Photo" : "Upload Photo"}
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2C3F51] text-white py-2 rounded hover:bg-[#243544] transition"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
