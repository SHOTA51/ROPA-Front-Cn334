'use client';

import React, { useEffect, useState } from 'react';
import { X, User as UserIcon } from 'lucide-react';
import * as api from '../lib/api';

interface ApiUser {
  id: number;
  username: string;
  email: string;
  name: string;
  enabled?: boolean;
  role?: { id: number; name: string } | null;
  department?: { id: number; name: string } | null;
  createdAt?: string;
}

interface RoleOpt {
  id: number;
  name: string;
}
interface DeptOpt {
  id: number;
  name: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  user: ApiUser | null;
  roles: RoleOpt[];
  departments: DeptOpt[];
}

export default function EditUserModal({
  isOpen,
  onClose,
  onSaved,
  user,
  roles,
  departments,
}: EditUserModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    roleId: '',
    departmentId: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        roleId: user.role?.id ? String(user.role.id) : '',
        departmentId: user.department?.id ? String(user.department.id) : '',
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await api.updateUser(user.id, {
        name: form.name,
        email: form.email,
        username: form.username,
        roleId: form.roleId ? Number(form.roleId) : undefined,
        departmentId: form.departmentId ? Number(form.departmentId) : null,
      });
      onSaved?.();
      onClose();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-8 py-4 bg-[#0F172A] text-white">
          <h2 className="text-2xl font-semibold">Edit User</h2>
          <button onClick={onClose} className="hover:bg-white/10 rounded-full p-1 transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="p-8 pb-6 flex flex-col">
          <div className="flex items-center gap-6 w-full mb-8">
            <div className="h-20 w-20 rounded-full border-4 border-gray-900 flex items-center justify-center overflow-hidden bg-gray-50">
              <UserIcon size={48} className="text-gray-900" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">{user.name}</span>
              <span className="text-sm text-gray-500">{user.username}</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                className="w-full bg-[#D1D5DB] rounded-full px-4 py-2 text-gray-700 text-sm border-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={update('username')}
                className="w-full bg-[#D1D5DB] rounded-full px-4 py-2 text-gray-700 text-sm border-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                className="w-full bg-[#D1D5DB] rounded-full px-4 py-2 text-gray-700 text-sm border-none focus:ring-1 focus:ring-slate-400"
              />
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

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Role</label>
              <select
                value={form.roleId}
                onChange={update('roleId')}
                className="w-full bg-[#D1D5DB] rounded-full px-4 py-2 text-gray-700 text-sm border-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="">Select</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-900">Date created</label>
              <input
                type="text"
                readOnly
                value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                className="w-full bg-gray-100 rounded-full px-4 py-2 text-gray-700 text-sm border-none"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="w-full flex justify-end mt-8 mb-2">
            <button
              onClick={handleSave}
              disabled={submitting}
              className="bg-[#0F172A] text-white font-semibold px-6 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
