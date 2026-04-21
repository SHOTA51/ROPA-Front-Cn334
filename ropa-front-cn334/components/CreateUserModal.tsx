'use client';

import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 bg-[#0F172A] text-white">
          <h2 className="text-2xl font-semibold">Create User</h2>
          <button onClick={onClose} className="hover:bg-white/10 rounded-full p-1 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 flex flex-col items-center">
          <div className="w-full space-y-6 flex flex-col items-center">
            {/* Username */}
            <div className="w-full max-w-xs space-y-1 text-center">
              <label className="block text-sm font-bold text-gray-900">Username</label>
              <input 
                type="text" 
                placeholder="Username"
                className="w-full bg-[#D1D5DB] rounded-full px-4 py-1.5 text-gray-700 placeholder:text-gray-500 text-sm border-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* Password */}
            <div className="w-full max-w-xs space-y-1 text-center">
              <label className="block text-sm font-bold text-gray-900">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="New Password"
                  className="w-full bg-[#D1D5DB] rounded-full px-4 py-1.5 pr-10 text-gray-700 placeholder:text-gray-500 text-sm border-none focus:ring-1 focus:ring-slate-400"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 inset-y-0 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="w-full max-w-xs space-y-1 text-center">
              <label className="block text-sm font-bold text-gray-900">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="New Password"
                  className="w-full bg-[#D1D5DB] rounded-full px-4 py-1.5 pr-10 text-gray-700 placeholder:text-gray-500 text-sm border-none focus:ring-1 focus:ring-slate-400"
                />
                <button 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 inset-y-0 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Footer Button */}
          <div className="w-full flex justify-end mt-12 mb-2">
            <button 
              onClick={onClose}
              className="bg-[#0F172A] text-white font-semibold px-6 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
            >
              Create User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
