'use client';

import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import * as api from '../lib/api';

interface RoleOpt {
  id: number;
  name: string;
}
interface DeptOpt {
  id: number;
  name: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  roles: RoleOpt[];
  departments: DeptOpt[];
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onCreated,
  roles,
  departments,
}: CreateUserModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    roleId: '',
    departmentId: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setError(null);
    if (!form.username || !form.password || !form.email || !form.name || !form.roleId) {
      setError('All fields except department are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await api.createUser({
        username: form.username.trim(),
        password: form.password,
        email: form.email.trim(),
        name: form.name.trim(),
        roleId: Number(form.roleId),
        departmentId: form.departmentId ? Number(form.departmentId) : null,
      });
      onCreated?.();
      setForm({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        name: '',
        roleId: '',
        departmentId: '',
      });
      onClose();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Create user failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-8 py-4 bg-[#0F172A] text-white">
          <h2 className="text-2xl font-semibold">Create User</h2>
          <button onClick={onClose} className="hover:bg-white/10 rounded-full p-1 transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="p-10 flex flex-col">
          <div className="w-full space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="Full name"
                className="w-full bg-[#D1D5DB] rounded-full px-4 py-2 text-gray-700 placeholder:text-gray-500 text-sm border-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={update('username')}
                placeholder="Username"
                className="w-full bg-[#D1D5DB] rounded-full px-4 py-2 text-gray-700 placeholder:text-gray-500 text-sm border-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="user@example.com"
                className="w-full bg-[#D1D5DB] rounded-full px-4 py-2 text-gray-700 placeholder:text-gray-500 text-sm border-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-gray-900">Role</label>
                <select
                  value={form.roleId}
                  onChange={update('roleId')}
                  className="w-full bg-[#D1D5DB] rounded-full px-4 py-2 text-gray-700 text-sm border-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="">Select role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-gray-900">Department</label>
                <select
                  value={form.departmentId}
                  onChange={update('departmentId')}
                  className="w-full bg-[#D1D5DB] rounded-full px-4 py-2 text-gray-700 text-sm border-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="">None</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Password"
                  className="w-full bg-[#D1D5DB] rounded-full px-4 py-2 pr-10 text-gray-700 placeholder:text-gray-500 text-sm border-none focus:ring-1 focus:ring-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 inset-y-0 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  placeholder="Confirm password"
                  className="w-full bg-[#D1D5DB] rounded-full px-4 py-2 pr-10 text-gray-700 placeholder:text-gray-500 text-sm border-none focus:ring-1 focus:ring-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 inset-y-0 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
          </div>

          <div className="w-full flex justify-end mt-6 mb-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#0F172A] text-white font-semibold px-6 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
