'use client';

import React from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown
} from 'lucide-react';

const auditLogs = [
  { date: '01/01/2026', time: '15:00', id: 1, name: 'Somchai Jaidee', role: 'Admin', activity: 'UPDATE', description: 'Lorem', sensitivity: 'High' },
  { date: '01/01/2026', time: '15:05', id: 2, name: 'Somchai Jaidee', role: 'Admin', activity: 'LOGIN', description: 'Lorem', sensitivity: 'Low' },
  { date: '01/01/2026', time: '15:10', id: 3, name: 'Somchai Jaidee', role: 'Admin', activity: 'CREATE', description: 'Lorem', sensitivity: 'Medium' },
  { date: '01/01/2026', time: '15:15', id: 4, name: 'Somchai Jaidee', role: 'Admin', activity: 'DELETE', description: 'Lorem', sensitivity: 'Medium' },
  { date: '01/01/2026', time: '15:20', id: 5, name: 'Somchai Jaidee', role: 'Admin', activity: 'CREATE', description: 'Lorem', sensitivity: 'Medium' },
  { date: '01/01/2026', time: '15:25', id: 6, name: 'Somchai Jaidee', role: 'Admin', activity: 'CREATE', description: 'Lorem', sensitivity: 'Medium' },
  { date: '01/01/2026', time: '15:30', id: 7, name: 'Somchai Jaidee', role: 'Admin', activity: 'CREATE', description: 'Lorem', sensitivity: 'Medium' },
  { date: '01/01/2026', time: '15:35', id: 8, name: 'Somsak Rakdee', role: 'Editor', activity: 'UPDATE', description: 'Modified record', sensitivity: 'High' },
  { date: '01/01/2026', time: '15:40', id: 9, name: 'Somsak Rakdee', role: 'Editor', activity: 'CREATE', description: 'New activity', sensitivity: 'Low' },
  { date: '01/01/2026', time: '15:45', id: 10, name: 'Somchai Jaidee', role: 'Admin', activity: 'LOGIN', description: 'System access', sensitivity: 'Low' },
  { date: '01/01/2026', time: '15:50', id: 11, name: 'Wichai Manee', role: 'User', activity: 'VIEW', description: 'Accessed report', sensitivity: 'Medium' },
  { date: '01/01/2026', time: '15:55', id: 12, name: 'Wichai Manee', role: 'User', activity: 'VIEW', description: 'Accessed report', sensitivity: 'Medium' },
  { date: '01/01/2026', time: '16:00', id: 13, name: 'Somchai Jaidee', role: 'Admin', activity: 'DELETE', description: 'Removed old log', sensitivity: 'High' },
  { date: '01/01/2026', time: '16:05', id: 14, name: 'Somsak Rakdee', role: 'Editor', activity: 'UPDATE', description: 'Fixed typo', sensitivity: 'Medium' },
  { date: '01/01/2026', time: '16:10', id: 15, name: 'Somchai Jaidee', role: 'Admin', activity: 'CREATE', description: 'New policy', sensitivity: 'High' },
  { date: '01/01/2026', time: '16:15', id: 16, name: 'Wichai Manee', role: 'User', activity: 'LOGIN', description: 'User login', sensitivity: 'Low' },
  { date: '01/01/2026', time: '16:20', id: 17, name: 'Somchai Jaidee', role: 'Admin', activity: 'UPDATE', description: 'Policy update', sensitivity: 'Medium' },
  { date: '01/01/2026', time: '16:25', id: 18, name: 'Somsak Rakdee', role: 'Editor', activity: 'CREATE', description: 'New record', sensitivity: 'Low' },
  { date: '01/01/2026', time: '16:30', id: 19, name: 'Somchai Jaidee', role: 'Admin', activity: 'DELETE', description: 'Cleanup', sensitivity: 'Medium' },
  { date: '01/01/2026', time: '16:35', id: 20, name: 'Wichai Manee', role: 'User', activity: 'VIEW', description: 'Summary view', sensitivity: 'Low' },
];

const getSensitivityBadge = (level: string) => {
  switch (level) {
    case 'High': return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
    case 'Medium': return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    case 'Low': return 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function AuditLogsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] space-y-8">
      {/* Page Header */}
      <div className="space-y-2 flex-none">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Audit Logs</h1>
        <p className="text-2xl font-normal text-gray-700">Check action logs</p>
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
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#E5E7EB] rounded-3xl overflow-auto shadow-sm border border-gray-200 flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 bg-[#E5E7EB] z-10">
            <tr className="text-gray-600 font-semibold text-sm border-b border-gray-300">
              <th className="px-8 py-5 flex items-center gap-1">
                Date - Time
                <ChevronDown size={16} />
              </th>
              <th className="px-6 py-5">ID</th>
              <th className="px-6 py-5">Name</th>
              <th className="px-6 py-5">Activity</th>
              <th className="px-6 py-5">Description</th>
              <th className="px-8 py-5 text-right flex items-center justify-end gap-1">
                Sensitivity
                <ChevronDown size={16} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {auditLogs.map((log) => (
              <tr key={log.id} className="text-gray-900 font-medium hover:bg-gray-200/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold">{log.date}</span>
                    <span className="text-sm font-normal text-gray-600">{log.time}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-lg">{log.id}</td>
                <td className="px-6 py-6">
                  <div className="flex flex-col">
                    <span className="text-lg">{log.name}</span>
                    <span className="text-xs text-gray-500 font-normal">{log.role}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-lg">{log.activity}</td>
                <td className="px-6 py-6 text-lg">{log.description}</td>
                <td className="px-8 py-6 text-right">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getSensitivityBadge(log.sensitivity)}`}>
                    {log.sensitivity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
