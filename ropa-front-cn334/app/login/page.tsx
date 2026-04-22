'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../lib/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, token, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && token) router.replace('/dashboard');
  }, [loading, token, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      router.replace('/dashboard');
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 relative">
      <div className="w-full max-w-[440px] flex flex-col items-center">
        <Logo className="mb-12" />

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full rounded-2xl bg-[#D9D9D9] px-6 py-4 text-xl font-medium text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-2xl bg-[#D9D9D9] px-6 py-4 text-xl font-medium text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all pr-14"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
            >
              {showPassword ? <EyeOff size={28} strokeWidth={2.5} /> : <Eye size={28} strokeWidth={2.5} />}
            </button>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-[#D9D9D9] py-4 text-2xl font-bold text-black transition-all hover:bg-gray-300 active:bg-gray-400 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Signing in…' : 'Log in'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-gray-500 leading-relaxed max-w-[340px]">
          <p>All accounts must be created by an administrator.</p>
          <p>Please contact the admin for further information.</p>
        </div>
      </div>
    </div>
  );
}
