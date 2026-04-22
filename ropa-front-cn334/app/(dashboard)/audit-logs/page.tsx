'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronDown, Check } from 'lucide-react';
import { useRole } from '../../../lib/store';
import * as api from '../../../lib/api';

interface AuditLog {
  id: number;
  activity: string;
  description: string;
  sensitivity: string;
  createdAt: string;
  user?: { id: number; name?: string; username?: string } | null;
}

const ACTIVITY_OPTIONS = ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE'];
const SENSITIVITY_OPTIONS = ['HIGH', 'MEDIUM', 'LOW'];

const getSensitivityBadge = (level: string) => {
  switch (level) {
    case 'HIGH':
      return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
    case 'MEDIUM':
      return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    case 'LOW':
      return 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function AuditLogsPage() {
  const { permissions } = useRole();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [searchDraft, setSearchDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    activity: [],
    sensitivity: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (searchQuery) params.search = searchQuery;
      if (activeFilters.activity[0]) params.activity = activeFilters.activity[0];
      if (activeFilters.sensitivity[0]) params.sensitivity = activeFilters.sensitivity[0];
      const res = await api.listAuditLogs(params);
      setLogs(res.data.logs || []);
      setPagination((p) => ({ ...p, ...(res.data.pagination || {}) }));
    } catch {
      setLogs([]);
    }
    setLoading(false);
  }, [pagination.page, pagination.limit, searchQuery, activeFilters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchDraft);
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const same = prev[category].includes(value);
      return { ...prev, [category]: same ? [] : [value] };
    });
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const clearFilters = () => {
    setActiveFilters({ activity: [], sensitivity: [] });
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const filterCategories: Record<string, string[]> = {
    activity: ACTIVITY_OPTIONS,
    sensitivity: SENSITIVITY_OPTIONS,
  };

  const hasFilters = Object.values(activeFilters).some((f) => f.length > 0);

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
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#E5E7EB] border-none text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <div className="flex items-center gap-3">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 h-12 px-6 rounded-xl font-medium transition-colors ${
                isFilterOpen || hasFilters
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
              <div className="absolute right-0 mt-2 w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
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
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
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
        </div>
      </div>

      <div className="bg-[#E5E7EB] rounded-3xl overflow-auto shadow-sm border border-gray-200 flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 bg-[#E5E7EB] z-10">
            <tr className="text-gray-600 font-semibold text-sm border-b border-gray-300">
              <th className="px-8 py-5">Date/Time</th>
              <th className="px-6 py-5">Name/Username</th>
              <th className="px-6 py-5">Activity</th>
              <th className="px-6 py-5">Description</th>
              <th className="px-8 py-5 text-right">Sensitivity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-500">
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const d = new Date(log.createdAt);
                return (
                  <tr
                    key={log.id}
                    className="text-gray-900 font-medium hover:bg-gray-200/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-lg">{d.toLocaleDateString()}</span>
                        <span className="text-xs text-gray-500">{d.toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-lg">
                      <div className="flex flex-col">
                        <span className="text-lg">{log.user?.name || '-'}</span>
                        <span className="text-xs text-gray-500">{log.user?.username || ''}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-lg font-bold">{log.activity}</td>
                    <td className="px-6 py-6 text-lg">{log.description}</td>
                    <td className="px-8 py-6 text-right">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getSensitivityBadge(
                          log.sensitivity,
                        )}`}
                      >
                        {log.sensitivity}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between flex-none">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            className="px-5 py-2 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 font-medium">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} logs)
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            className="px-5 py-2 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
