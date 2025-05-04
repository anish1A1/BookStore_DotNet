"use client";

import Link from "next/link";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

import { UserIcon, MailIcon, LockIcon } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md border border-gray-300 rounded-lg bg-white p-6 shadow">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="font-bold text-xl text-white">R</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">Staff Register</h1>

        <form className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter your name"
            startAdornment={<UserIcon className="w-4 h-4" />}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            startAdornment={<MailIcon className="w-4 h-4" />}
          />

          <Input
            label="Username"
            placeholder="Choose a username"
            startAdornment={<UserIcon className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            startAdornment={<LockIcon className="w-4 h-4" />}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            startAdornment={<LockIcon className="w-4 h-4" />}
          />

          <Button variant="primary" className="w-full">
            Register
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/staff/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
