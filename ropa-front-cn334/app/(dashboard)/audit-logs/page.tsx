'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown,
  Check
} from 'lucide-react';
import { useRole } from '../../../lib/store';

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

const filterCategories = {
  activity: Array.from(new Set(auditLogs.map(l => l.activity))),
  sensitivity: ['High', 'Medium', 'Low']
};

export default function AuditLogsPage() {
  const { permissions } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string[] }>({
    activity: [],
    sensitivity: []
  });

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[category];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const clearFilters = () => {
    setActiveFilters({ activity: [], sensitivity: [] });
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.name.toLowerCase().includes(searchQuery.toLowerCase()) || log.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActivity = activeFilters.activity.length === 0 || activeFilters.activity.includes(log.activity);
    const matchesSensitivity = activeFilters.sensitivity.length === 0 || activeFilters.sensitivity.includes(log.sensitivity);
    return matchesSearch && matchesActivity && matchesSensitivity;
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

  if (!permissions.sidebar.auditLogs) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-gray-400">Access Denied</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] space-y-8">
      <div className="space-y-2 flex-none">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Audit Logs</h1>
        <p className="text-2xl font-normal text-gray-700">Check action logs</p>
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
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center gap-2 h-12 px-6 rounded-xl font-medium transition-colors ${isFilterOpen || Object.values(activeFilters).some(f => f.length > 0) ? 'bg-blue-600 text-white' : 'bg-[#E5E7EB] text-gray-700 hover:bg-gray-300'}`}>
              <Filter size={20} />
              <span>Filters</span>
              <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                    <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline font-medium">Clear All</button>
                  </div>
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(filterCategories).map(([category, options]) => (
                      <div key={category} className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{category}</h4>
                        <div className="space-y-2">
                          {options.map(option => (
                            <label key={option} className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative flex items-center">
                                <input type="checkbox" className="peer appearance-none h-5 w-5 rounded border-2 border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" checked={activeFilters[category].includes(option)} onChange={() => toggleFilter(category, option)} />
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
        </div>
      </div>

      <div className="bg-[#E5E7EB] rounded-3xl overflow-auto shadow-sm border border-gray-200 flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 bg-[#E5E7EB] z-10">
            <tr className="text-gray-600 font-semibold text-sm border-b border-gray-300">
              <th className="px-8 py-5">Date/Time</th>
              <th className="px-6 py-5">Name/Role</th>
              <th className="px-6 py-5">Activity</th>
              <th className="px-6 py-5">Description</th>
              <th className="px-8 py-5 text-right">Sensitivity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="text-gray-900 font-medium hover:bg-gray-200/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-lg">{log.date}</span>
                    <span className="text-xs text-gray-500">{log.time}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-lg">
                  <div className="flex flex-col">
                    <span className="text-lg">{log.name}</span>
                    <span className="text-xs text-gray-500">{log.role}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-lg font-bold">{log.activity}</td>
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
