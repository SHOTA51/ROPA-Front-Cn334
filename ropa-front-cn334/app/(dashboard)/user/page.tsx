'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import EmployeeProfileModal from '../../../components/EmployeeProfileModal';
import EditUserModal from '../../../components/EditUserModal';
import CreateUserModal from '../../../components/CreateUserModal';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  SquarePen,
  Trash2,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useRole } from '../../../lib/store';
import * as api from '../../../lib/api';

interface ApiUser {
  id: number;
  username: string;
  email: string;
  name: string;
  enabled?: boolean;
  status?: string;
  lastActive?: string | null;
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

const ROLE_OPTIONS_STATIC = ['Admin', 'DataOwner', 'DPO', 'Auditor', 'Executive'];
const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE'];

export default function UserPage() {
  const { permissions } = useRole();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [roles, setRoles] = useState<RoleOpt[]>([]);
  const [departments, setDepartments] = useState<DeptOpt[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ApiUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    department: [],
    role: [],
    status: [],
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.listUsers();
      setUsers(Array.isArray(res.data) ? res.data : res.data?.users || []);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  }, []);

  const fetchLookups = useCallback(async () => {
    try {
      const [rolesRes, deptRes] = await Promise.all([api.listRoles(), api.listDepartments()]);
      setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : rolesRes.data?.roles || []);
      setDepartments(
        Array.isArray(deptRes.data) ? deptRes.data : deptRes.data?.departments || [],
      );
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchLookups();
  }, [fetchUsers, fetchLookups]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenProfile = (user: ApiUser) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  const handleOpenEdit = (user: ApiUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: ApiUser) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.deleteUser(userToDelete.id);
      await fetchUsers();
    } catch {
      alert('Delete failed');
    }
    setUserToDelete(null);
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const next = prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value];
      return { ...prev, [category]: next };
    });
  };

  const clearFilters = () => setActiveFilters({ department: [], role: [], status: [] });

  const departmentOptions = departments.length
    ? departments.map((d) => d.name)
    : Array.from(new Set(users.map((u) => u.department?.name).filter(Boolean) as string[]));

  const filterCategories: Record<string, string[]> = {
    department: departmentOptions,
    role: roles.length ? roles.map((r) => r.name) : ROLE_OPTIONS_STATIC,
    status: STATUS_OPTIONS,
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q);

    const matchesDept =
      activeFilters.department.length === 0 ||
      (u.department?.name ? activeFilters.department.includes(u.department.name) : false);
    const matchesRole =
      activeFilters.role.length === 0 ||
      (u.role?.name ? activeFilters.role.includes(u.role.name) : false);
    const matchesStatus =
      activeFilters.status.length === 0 ||
      (u.status ? activeFilters.status.includes(u.status) : false);
    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  const hasManagementPermission = permissions.user.edit || permissions.user.delete;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] space-y-8">
      <div className="space-y-2 flex-none">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">User</h1>
        <p className="text-2xl font-normal text-gray-700">Manage user&apos;s permission</p>
      </div>

      <div className="flex justify-between items-center bg-transparent gap-4 flex-none relative">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#E5E7EB] border-none text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 h-12 px-6 rounded-xl font-medium transition-colors ${
                isFilterOpen || Object.values(activeFilters).some((f) => f.length > 0)
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#E5E7EB] text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Filter size={20} />
              <span>Filters</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(filterCategories).map(([category, options]) => (
                      <div key={category} className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                          {category}
                        </h4>
                        <div className="space-y-2">
                          {options.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <div className="relative flex items-center">
                                <input
                                  type="checkbox"
                                  className="peer appearance-none h-5 w-5 rounded border-2 border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                  checked={activeFilters[category].includes(option)}
                                  onChange={() => toggleFilter(category, option)}
                                />
                                <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
                              </div>
                              <span className="text-gray-700 font-medium group-hover:text-gray-900 capitalize">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 flex justify-end">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="bg-[#0F172A] text-white px-8 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {permissions.user.create && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 transition-colors"
            >
              <Plus size={20} />
              <span>Create User</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-[#E5E7EB] rounded-3xl overflow-auto shadow-sm border border-gray-200 flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 bg-[#E5E7EB] z-10">
            <tr className="text-gray-600 font-semibold text-sm border-b border-gray-300">
              <th className="px-8 py-5">Name/Role</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Department</th>
              <th className="px-6 py-5">Status</th>
              {hasManagementPermission && (
                <th className="px-8 py-5 text-right">Manage User</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="text-gray-900 font-medium hover:bg-gray-200/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-lg">{u.name || u.username}</span>
                      <span className="text-xs text-gray-500">{u.role?.name || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-lg">{u.email}</td>
                  <td className="px-6 py-6 text-lg">{u.department?.name || '-'}</td>
                  <td className="px-6 py-6 text-lg">{u.status || (u.enabled ? 'ACTIVE' : 'INACTIVE')}</td>
                  {hasManagementPermission && (
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-4 text-gray-700">
                        {permissions.user.viewDetails && (
                          <button
                            onClick={() => handleOpenProfile(u)}
                            className="hover:text-black transition-colors"
                          >
                            <MoreHorizontal size={24} />
                          </button>
                        )}
                        {permissions.user.edit && (
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="hover:text-blue-600 transition-colors"
                          >
                            <SquarePen size={24} />
                          </button>
                        )}
                        {permissions.user.delete && (
                          <button
                            onClick={() => handleDelete(u)}
                            className="hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={24} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EmployeeProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedUser}
      />
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        onSaved={fetchUsers}
        user={selectedUser}
        roles={roles}
        departments={departments}
      />
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={fetchUsers}
        roles={roles}
        departments={departments}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={userToDelete?.name || userToDelete?.username || ''}
      />
    </div>
  );
}
