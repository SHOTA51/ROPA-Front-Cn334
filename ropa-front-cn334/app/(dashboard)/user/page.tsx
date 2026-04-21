'use client';

import React, { useState, useRef, useEffect } from 'react';
import EmployeeProfileModal from '../../../components/EmployeeProfileModal';
import EditUserModal from '../../../components/EditUserModal';
import CreateUserModal from '../../../components/CreateUserModal';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  SquarePen, 
  Trash2,
  ChevronDown,
  Check
} from 'lucide-react';
import { useRole } from '../../../lib/store';

const users = [
  { name: 'Somchai Jaidee', role: 'Admin', email: 'somchai@gmail.com', department: 'IT', status: 'Online' },
  { name: 'Somsak Rakdee', role: 'Admin', email: 'somsak@gmail.com', department: 'IT', status: 'Offline' },
  { name: 'Wichai Manee', role: 'Data Owner', email: 'wichai@gmail.com', department: 'HR', status: 'Online' },
  { name: 'Somsri Sukjai', role: 'DPO', email: 'somsri@gmail.com', department: 'Finance', status: 'Online' },
  { name: 'Mana Choodee', role: 'Auditor', email: 'mana@gmail.com', department: 'Marketing', status: 'Online' },
  { name: 'Piti Wangdee', role: 'Executive', email: 'piti@gmail.com', department: 'Sales', status: 'Offline' },
  { name: 'Chujai Deeha', role: 'Data Owner', email: 'chujai@gmail.com', department: 'IT', status: 'Online' },
  { name: 'Ananda Hope', role: 'Admin', email: 'ananda@gmail.com', department: 'IT', status: 'Online' },
  { name: 'Bella Swan', role: 'DPO', email: 'bella@gmail.com', department: 'Marketing', status: 'Offline' },
  { name: 'Charlie Brown', role: 'Auditor', email: 'charlie@gmail.com', department: 'Content', status: 'Online' },
  { name: 'David Goggins', role: 'Executive', email: 'david@gmail.com', department: 'Training', status: 'Online' },
  { name: 'Elon Musk', role: 'Admin', email: 'elon@gmail.com', department: 'Tech', status: 'Online' },
  { name: 'Fiona Shrek', role: 'Data Owner', email: 'fiona@gmail.com', department: 'HR', status: 'Offline' },
  { name: 'George Clooney', role: 'Auditor', email: 'george@gmail.com', department: 'Publicity', status: 'Online' },
  { name: 'Harry Potter', role: 'DPO', email: 'harry@gmail.com', department: 'Library', status: 'Online' },
  { name: 'Iris West', role: 'Data Owner', email: 'iris@gmail.com', department: 'Journalism', status: 'Online' },
  { name: 'John Wick', role: 'Admin', email: 'john@gmail.com', department: 'Security', status: 'Online' },
  { name: 'Kevin Hart', role: 'Executive', email: 'kevin@gmail.com', department: 'Entertainment', status: 'Offline' },
  { name: 'Lara Croft', role: 'Auditor', email: 'lara@gmail.com', department: 'Archive', status: 'Online' },
  { name: 'Mario Rossi', role: 'DPO', email: 'mario@gmail.com', department: 'IT', status: 'Online' },
];

const filterCategories = {
  department: Array.from(new Set(users.map(u => u.department))),
  role: ['Admin', 'Data Owner', 'DPO', 'Auditor', 'Executive'],
  status: ['Online', 'Offline']
};

export default function UserPage() {
  const { permissions } = useRole();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string[] }>({
    department: [],
    role: [],
    status: []
  });

  const handleOpenProfile = (user: any) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const next = prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value];
      return { ...prev, [category]: next };
    });
  };

  const clearFilters = () => {
    setActiveFilters({ department: [], role: [], status: [] });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = activeFilters.department.length === 0 || activeFilters.department.includes(user.department);
    const matchesRole = activeFilters.role.length === 0 || activeFilters.role.includes(user.role);
    const matchesStatus = activeFilters.status.length === 0 || activeFilters.status.includes(user.status);
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasManagementPermission = permissions.user.edit || permissions.user.delete;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] space-y-8">
      <div className="space-y-2 flex-none">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">User</h1>
        <p className="text-2xl font-normal text-gray-700">Manage user's permission</p>
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
              className={`flex items-center gap-2 h-12 px-6 rounded-xl font-medium transition-colors ${isFilterOpen || Object.values(activeFilters).some(f => f.length > 0) ? 'bg-blue-600 text-white' : 'bg-[#E5E7EB] text-gray-700 hover:bg-gray-300'}`}
            >
              <Filter size={20} />
              <span>Filters</span>
              <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                    <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline font-medium">Clear All</button>
                  </div>
                  <div className="grid grid-cols-2 gap-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(filterCategories).map(([category, options]) => (
                      <div key={category} className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{category}</h4>
                        <div className="space-y-2">
                          {options.map(option => (
                            <label key={option} className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative flex items-center">
                                <input 
                                  type="checkbox" 
                                  className="peer appearance-none h-5 w-5 rounded border-2 border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                  checked={activeFilters[category].includes(option)}
                                  onChange={() => toggleFilter(category, option)}
                                />
                                <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
                              </div>
                              <span className="text-gray-700 font-medium group-hover:text-gray-900 capitalize">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 flex justify-end">
                   <button onClick={() => setIsFilterOpen(false)} className="bg-[#0F172A] text-white px-8 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors">Apply Filters</button>
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
            {filteredUsers.map((user, idx) => (
              <tr key={idx} className="text-gray-900 font-medium hover:bg-gray-200/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-lg">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-lg">{user.email}</td>
                <td className="px-6 py-6 text-lg">{user.department}</td>
                <td className="px-6 py-6 text-lg">{user.status}</td>
                {hasManagementPermission && (
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-4 text-gray-700">
                      {permissions.user.viewDetails && (
                        <button onClick={() => handleOpenProfile(user)} className="hover:text-black transition-colors">
                          <MoreHorizontal size={24} />
                        </button>
                      )}
                      {permissions.user.edit && (
                        <button onClick={() => handleOpenEdit(user)} className="hover:text-blue-600 transition-colors">
                          <SquarePen size={24} />
                        </button>
                      )}
                      {permissions.user.delete && (
                        <button className="hover:text-red-600 transition-colors">
                          <Trash2 size={24} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EmployeeProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={selectedUser} />
      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} />
      <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
