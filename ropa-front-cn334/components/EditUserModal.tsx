'use client';

import React from 'react';
import { X, User as UserIcon } from 'lucide-react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 bg-[#0F172A] text-white">
          <h2 className="text-2xl font-semibold">Employee's Profile</h2>
          <button onClick={onClose} className="hover:bg-white/10 rounded-full p-1 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 pb-6 flex flex-col items-center">
          {/* Profile Section */}
          <div className="flex items-center gap-6 w-full mb-8">
            <div className="h-20 w-20 rounded-full border-4 border-gray-900 flex items-center justify-center overflow-hidden bg-gray-50">
               <UserIcon size={48} className="text-gray-900" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">{user.name}</span>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
            {/* Department */}
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Department</label>
              <input 
                type="text" 
                defaultValue={user.department}
                className="w-full bg-[#D1D5DB] rounded-full px-4 py-1.5 text-gray-700 text-sm border-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Role</label>
              <input 
                type="text" 
                defaultValue={user.role}
                className="w-full bg-[#D1D5DB] rounded-full px-4 py-1.5 text-gray-700 text-sm border-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* Date created */}
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Date created</label>
              <input 
                type="text" 
                defaultValue="01/01/2000"
                className="w-full bg-[#D1D5DB] rounded-full px-4 py-1.5 text-gray-700 text-sm border-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Email</label>
              <input 
                type="email" 
                defaultValue={user.email}
                className="w-full bg-[#D1D5DB] rounded-full px-4 py-1.5 text-gray-700 text-sm border-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          {/* Footer Button */}
          <div className="w-full flex justify-end mt-12 mb-2">
            <button 
              onClick={onClose}
              className="bg-[#0F172A] text-white font-semibold px-6 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
