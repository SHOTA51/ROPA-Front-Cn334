'use client';

import React, { useState } from 'react';
import { X, Eye, EyeOff, User as UserIcon } from 'lucide-react';
import * as api from '../lib/api';
import { useAuth } from '../lib/AuthContext';

interface ApiUser {
  id: number;
  username: string;
  email: string;
  name: string;
  role?: { id: number; name: string } | null;
  department?: { id: number; name: string } | null;
}

interface EmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ApiUser | null;
}

export default function EmployeeProfileModal({
  isOpen,
  onClose,
  user,
}: EmployeeProfileModalProps) {
  const { user: currentUser } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const isSelf = currentUser?.id === user.id;

  const handleChangePassword = async () => {
    setMessage(null);
    if (!currentPassword || !newPassword) {
      setMessage({ type: 'error', text: 'Both fields are required' });
      return;
    }
    setSubmitting(true);
    try {
      if (isSelf) {
        await api.changePassword(currentPassword, newPassword);
      } else {
        await api.updateUser(user.id, { password: newPassword });
      }
      setMessage({ type: 'success', text: 'Password updated' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setMessage({ type: 'error', text: e?.response?.data?.message || 'Failed to update password' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-8 py-4 bg-[#0F172A] text-white">
          <h2 className="text-2xl font-semibold">Employee&apos;s Profile</h2>
          <button onClick={onClose} className="hover:bg-white/10 rounded-full p-1 transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="p-8 pb-4 flex flex-col items-center">
          <div className="flex items-center gap-6 w-full mb-6">
            <div className="h-20 w-20 rounded-full border-4 border-gray-900 flex items-center justify-center overflow-hidden bg-gray-50">
              <UserIcon size={48} className="text-gray-900" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">{user.name}</span>
              <span className="text-sm text-gray-500">{user.email}</span>
              <span className="text-xs text-gray-400">
                {user.role?.name} · {user.department?.name || 'No Dept'}
              </span>
            </div>
          </div>

          <div className="w-full space-y-4 flex flex-col items-center">
            {isSelf && (
              <div className="w-full max-w-xs space-y-1 text-center">
                <label className="block text-sm font-bold text-gray-900">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="w-full bg-[#D1D5DB] rounded-full px-4 py-1.5 pr-10 text-gray-700 placeholder:text-gray-500 text-sm border-none focus:ring-1 focus:ring-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 inset-y-0 flex items-center text-gray-500"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <div className="w-full max-w-xs space-y-1 text-center">
              <label className="block text-sm font-bold text-gray-900">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full bg-[#D1D5DB] rounded-full px-4 py-1.5 pr-10 text-gray-700 placeholder:text-gray-500 text-sm border-none focus:ring-1 focus:ring-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 inset-y-0 flex items-center text-gray-500"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`w-full max-w-xs text-center text-sm font-medium ${
                  message.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}
          </div>

          <div className="w-full flex justify-end mt-8 mb-2">
            <button
              onClick={handleChangePassword}
              disabled={submitting}
              className="bg-[#0F172A] text-white font-semibold px-6 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating…' : 'Change Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
