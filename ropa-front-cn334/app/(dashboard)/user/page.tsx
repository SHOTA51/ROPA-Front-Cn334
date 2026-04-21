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
  { name: 'Somsak Rakdee', role: 'Admin', email: 'somsak@gmail.com', department: 'IT', status: 'Offline' },
  { name: 'Wichai Manee', role: 'User', email: 'wichai@gmail.com', department: 'HR', status: 'Online' },
  { name: 'Somsri Sukjai', role: 'User', email: 'somsri@gmail.com', department: 'Finance', status: 'Online' },
  { name: 'Mana Choodee', role: 'Editor', email: 'mana@gmail.com', department: 'Marketing', status: 'Online' },
  { name: 'Piti Wangdee', role: 'User', email: 'piti@gmail.com', department: 'Sales', status: 'Offline' },
  { name: 'Chujai Deeha', role: 'User', email: 'chujai@gmail.com', department: 'IT', status: 'Online' },
  { name: 'Ananda Hope', role: 'Admin', email: 'ananda@gmail.com', department: 'IT', status: 'Online' },
  { name: 'Bella Swan', role: 'User', email: 'bella@gmail.com', department: 'Marketing', status: 'Offline' },
  { name: 'Charlie Brown', role: 'Editor', email: 'charlie@gmail.com', department: 'Content', status: 'Online' },
  { name: 'David Goggins', role: 'User', email: 'david@gmail.com', department: 'Training', status: 'Online' },
  { name: 'Elon Musk', role: 'Admin', email: 'elon@gmail.com', department: 'Tech', status: 'Online' },
  { name: 'Fiona Shrek', role: 'User', email: 'fiona@gmail.com', department: 'HR', status: 'Offline' },
  { name: 'George Clooney', role: 'User', email: 'george@gmail.com', department: 'Publicity', status: 'Online' },
  { name: 'Harry Potter', role: 'Editor', email: 'harry@gmail.com', department: 'Library', status: 'Online' },
  { name: 'Iris West', role: 'User', email: 'iris@gmail.com', department: 'Journalism', status: 'Online' },
  { name: 'John Wick', role: 'Admin', email: 'john@gmail.com', department: 'Security', status: 'Online' },
  { name: 'Kevin Hart', role: 'User', email: 'kevin@gmail.com', department: 'Entertainment', status: 'Offline' },
  { name: 'Lara Croft', role: 'User', email: 'lara@gmail.com', department: 'Archive', status: 'Online' },
  { name: 'Mario Rossi', role: 'Editor', email: 'mario@gmail.com', department: 'IT', status: 'Online' },
];

export default function UserPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] space-y-8">
      {/* Page Header */}
      <div className="space-y-2 flex-none">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">User</h1>
        <p className="text-2xl font-normal text-gray-700">Manage user's permission</p>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-transparent gap-4 flex-none">
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
            <span>Filters</span>
            <ChevronDown size={16} />
          </button>
          
          <button className="flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 transition-colors">
            <Plus size={20} />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#E5E7EB] rounded-3xl overflow-auto shadow-sm border border-gray-200 flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 bg-[#E5E7EB] z-10">
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
