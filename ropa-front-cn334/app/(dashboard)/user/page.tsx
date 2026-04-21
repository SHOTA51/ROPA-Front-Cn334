'use client';

import React from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  SquarePen, 
  Trash2,
  ChevronDown
} from 'lucide-react';

const users = [
  { name: 'Somchai Jaidee', role: 'Admin', email: 'somchai@gmail.com', department: 'IT', status: 'Online' },
  { name: 'Somchai Jaidee', role: 'Admin', email: 'somchai@gmail.com', department: 'IT', status: 'Offline' },
  { name: 'Somchai Jaidee', role: 'Admin', email: 'somchai@gmail.com', department: 'IT', status: 'Online' },
  { name: 'Somchai Jaidee', role: 'Admin', email: 'somchai@gmail.com', department: 'IT', status: 'Online' },
  { name: 'Somchai Jaidee', role: 'Admin', email: 'somchai@gmail.com', department: 'IT', status: 'Online' },
  { name: 'Somchai Jaidee', role: 'Admin', email: 'somchai@gmail.com', department: 'IT', status: 'Online' },
  { name: 'Somchai Jaidee', role: 'Admin', email: 'somchai@gmail.com', department: 'IT', status: 'Online' },
];

export default function UserPage() {
  return (
    <div className="flex flex-col space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">User</h1>
        <p className="text-2xl font-normal text-gray-700">Manage user's permission</p>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-transparent gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#E5E7EB] border-none text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 transition-colors">
            <Filter size={20} />
            <span>Data Access Filters</span>
            <ChevronDown size={16} />
          </button>
          
          <button className="flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 transition-colors">
            <Plus size={20} />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#E5E7EB] rounded-3xl overflow-hidden shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 font-semibold text-sm border-b border-gray-300">
              <th className="px-8 py-5">Name/Role</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Department</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-8 py-5 text-right">Manage User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {users.map((user, idx) => (
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
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-4 text-gray-700">
                    <button className="hover:text-black">
                      <MoreHorizontal size={24} />
                    </button>
                    <button className="hover:text-blue-600">
                      <SquarePen size={24} />
                    </button>
                    <button className="hover:text-red-600">
                      <Trash2 size={24} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
