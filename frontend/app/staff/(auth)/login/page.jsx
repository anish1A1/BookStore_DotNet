"use client";

import Link from "next/link";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

import { UserIcon, LockIcon } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md border border-gray-300 rounded-lg bg-white p-6 shadow">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#2D3F50] rounded-full flex items-center justify-center">
            <span className="font-bold text-xl text-white">L</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6 text-[#2D3F50]">
          Staff Login
        </h1>

        <form className="space-y-4">
          <Input
            label="Username"
            placeholder="Enter your username"
            // className="border border-gray-300 placeholder-shown:border-[#F0C40E]"
            startAdornment={<UserIcon className="w-4 h-4 text-gray-600 " />}
            // className="bg-[#F0C40E] placeholder-black text-black"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            startAdornment={<LockIcon className="w-4 h-4 text-gray-400" />}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <Link href="#" className="text-sm text-[#2D3F50] hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Custom-colored Button */}
          <button
            type="submit"
            className="w-full bg-[#2D3F50] hover:bg-[#253447] text-white focus:outline-none focus:ring-2 focus:ring-[#253447] rounded py-2"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/staff/register"
            className="text-[#2D3F50] hover:underline"
          >
            Register here
          </Link>
        </p>

        <p className="mt-6 text-center text-sm text-gray-500">
          Need help? Contact IT Support at{" "}
          <a
            href="mailto:support@bookstore.com"
            className="underline text-[#2D3F50]"
          >
            support@bookstore.com
          </a>
        </p>
      </div>
    </div>
  );
}
