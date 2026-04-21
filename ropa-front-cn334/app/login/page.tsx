'use client';

import React, { useState } from 'react';
import Logo from '../../components/Logo';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to dashboard on login
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-[440px] flex flex-col items-center">
        {/* Logo Section */}
        <Logo className="mb-12" />

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-6">
          {/* Username Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl bg-[#D9D9D9] px-6 py-4 text-xl font-medium text-black placeholder:text-gray-500 focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl bg-[#D9D9D9] px-6 py-4 text-xl font-medium text-black placeholder:text-gray-500 focus:outline-none pr-14"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <EyeOff size={28} strokeWidth={2.5} />
              ) : (
                <Eye size={28} strokeWidth={2.5} />
              )}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#D9D9D9] py-4 text-2xl font-medium text-black transition-colors hover:bg-gray-300 active:bg-gray-400"
          >
            Log in
          </button>
        </form>

        {/* Footer Text */}
        <div className="mt-8 text-center text-sm font-medium text-gray-500 leading-relaxed max-w-[340px]">
          <p>All accounts must be created by an administrator.</p>
          <p>Please contact the admin for further information.</p>
        </div>
      </div>
    </div>
  );
}
