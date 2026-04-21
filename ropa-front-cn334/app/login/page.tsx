'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import Logo from '../../components/Logo';
import { useRole } from '../../lib/store';
import { Role } from '../../lib/permissions';

export default function LoginPage() {
  const router = useRouter();
  const { role, setRole } = useRole();
  
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const roles: Role[] = ['Admin', 'Data Owner', 'DPO', 'Auditor', 'Executive'];

  // Handle click outside for role dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 relative">
      
      {/* Demo Role Switcher - Dev Only */}
      <div className="absolute top-6 right-6" ref={roleMenuRef}>
        <button 
          onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
          className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-xl text-sm transition-colors border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-sm shadow-blue-500/50"></div>
            <span className="text-gray-500 font-medium">Role:</span>
            <span className="font-bold text-gray-900">{role}</span>
          </div>
          <ChevronDown size={16} className={`text-gray-500 transition-transform ${isRoleMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isRoleMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl z-50 py-1">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Demo Role</span>
            </div>
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setIsRoleMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  role === r 
                    ? 'text-blue-600 font-bold bg-blue-50' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-[440px] flex flex-col items-center">
        {/* Brand Header */}
        <Logo className="mb-12" />

        {/* Authentication Form */}
        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl bg-[#D9D9D9] px-6 py-4 text-xl font-medium text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#D9D9D9] py-4 text-2xl font-bold text-black transition-all hover:bg-gray-300 active:bg-gray-400 shadow-sm"
          >
            Log in
          </button>
        </form>

        {/* Support Information */}
        <div className="mt-8 text-center text-sm font-medium text-gray-500 leading-relaxed max-w-[340px]">
          <p>All accounts must be created by an administrator.</p>
          <p>Please contact the admin for further information.</p>
        </div>
      </div>
    </div>
  );
}
