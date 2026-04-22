'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Upload,
  Download,
  Eye,
  Trash2,
  Check,
  X,
  ChevronDown,
  Plus,
} from 'lucide-react';

import StatCard from '../../../components/StatCard';
import RecordDetailModal from '../../../components/RecordDetailModal';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import { useRole } from '../../../lib/store';
import * as api from '../../../lib/api';

interface RopaRecord {
  id: number;
  purpose: string;
  status: string;
  dataSubject: string;
  dataCategory: string;
  legalBasis: string;
  riskLevel: string;
  retentionPeriod: string;
  department?: { id: number; name: string } | null;
  createdBy?: { id: number; name: string };
  updatedBy?: { id: number; name: string };
  [key: string]: unknown;
}

interface DashboardStats {
  totalRecords: number;
  complianceScore: number;
  pendingReview: number;
  highRiskCount: number;
  statusDistribution: Record<string, number>;
}

const STATUS_OPTIONS = ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ACTIVE'];
const RISK_OPTIONS = ['HIGH', 'MEDIUM', 'LOW'];
const LEGAL_OPTIONS = [
  'CONSENT',
  'CONTRACT',
  'LEGAL_OBLIGATION',
  'VITAL_INTEREST',
  'PUBLIC_TASK',
  'LEGITIMATE_INTEREST',
];
const DATA_TYPE_OPTIONS = ['GENERAL', 'SENSITIVE'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED':
    case 'ACTIVE':
      return 'bg-[#22C55E]';
    case 'REJECTED':
      return 'bg-[#EF4444]';
    case 'PENDING_REVIEW':
      return 'bg-[#F59E0B]';
    case 'DRAFT':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

const getRiskBadge = (level: string) => {
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

export default function DashboardPage() {
  const router = useRouter();
  const { role, permissions } = useRole();

  const [data, setData] = useState<RopaRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const [selectedRecord, setSelectedRecord] = useState<RopaRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<RopaRecord | null>(null);

  const [searchDraft, setSearchDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    status: [],
    riskLevel: [],
    legalBasis: [],
    dataType: [],
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.getDashboard();
      setStats(res.data);
    } catch {
      /* ignore */
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (searchQuery) params.search = searchQuery;
      if (activeFilters.status[0]) params.status = activeFilters.status[0];
      if (activeFilters.riskLevel[0]) params.riskLevel = activeFilters.riskLevel[0];
      if (activeFilters.legalBasis[0]) params.legalBasis = activeFilters.legalBasis[0];
      if (activeFilters.dataType[0]) params.dataType = activeFilters.dataType[0];
      const res = await api.listRopa(params);
      setData(res.data.records || []);
      setPagination((p) => ({ ...p, ...(res.data.pagination || {}) }));
    } catch {
      setData([]);
    }
    setLoading(false);
  }, [pagination.page, pagination.limit, searchQuery, activeFilters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewRecord = (record: RopaRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (record: RopaRecord) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      await api.deleteRopa(recordToDelete.id);
      await fetchData();
      await fetchStats();
    } catch {
      /* ignore */
    }
    setRecordToDelete(null);
  };

  const handleApprove = async (record: RopaRecord) => {
    try {
      await api.approveRopa(record.id);
      await fetchData();
      await fetchStats();
    } catch {
      /* ignore */
    }
  };

  const handleReject = async (record: RopaRecord) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await api.rejectRopa(record.id, reason);
      await fetchData();
      await fetchStats();
    } catch {
      /* ignore */
    }
  };

  const handleImportClick = () => importInputRef.current?.click();

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await api.importRopa(file);
      await fetchData();
      await fetchStats();
      alert('Import successful');
    } catch {
      alert('Import failed');
    } finally {
      if (importInputRef.current) importInputRef.current.value = '';
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.exportRopa();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `ropa-export-${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Export failed');
    }
  };

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
    setActiveFilters({ status: [], riskLevel: [], legalBasis: [], dataType: [] });
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const filterCategories: Record<string, string[]> = {
    status: STATUS_OPTIONS,
    riskLevel: RISK_OPTIONS,
    legalBasis: LEGAL_OPTIONS,
    dataType: DATA_TYPE_OPTIONS,
  };

  const hasFilters = Object.values(activeFilters).some((f) => f.length > 0);
  const approvedCount =
    (stats?.statusDistribution?.APPROVED || 0) + (stats?.statusDistribution?.ACTIVE || 0);
  const rejectedCount = stats?.statusDistribution?.REJECTED || 0;
  const pendingCount = stats?.pendingReview || 0;

  const pendingExtra = permissions.dashboard.pendingRequest ? (
    <div className="flex flex-col items-center">
      {isReviewMode ? (
        <button
          onClick={() => setIsReviewMode(false)}
          className="px-6 py-1.5 rounded-full border border-gray-400 text-gray-700 text-sm font-bold bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          Cancel
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsReviewMode(true)}
            className="px-4 py-1.5 rounded-full border border-gray-900 text-gray-900 text-sm font-bold bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            Pending Request
          </button>
          {pendingCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
              {pendingCount}
            </div>
          )}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] space-y-8">
      <div className="flex-none">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          RoPA - Record of Processing Activities
        </h1>
      </div>

      <div className="flex gap-6 w-full flex-none">
        <StatCard
          title="Total Record"
          value={String(stats?.totalRecords ?? '–')}
          icon={ClipboardList}
          iconColor="text-blue-500"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Approved"
          value={String(approvedCount)}
          icon={CheckCircle2}
          iconColor="text-green-500"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Rejected"
          value={String(rejectedCount)}
          icon={XCircle}
          iconColor="text-red-500"
          bgColor="bg-red-50"
        />
        <StatCard
          title="Pending"
          value={String(pendingCount)}
          icon={Clock}
          iconColor="text-yellow-500"
          bgColor="bg-yellow-50"
          extra={pendingExtra}
        />
      </div>

      <div className="flex justify-between items-center bg-transparent gap-4 flex-none relative">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search records..."
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
                                {option.replace(/_/g, ' ').toLowerCase()}
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

          {permissions.dashboard.import && (
            <>
              <input
                ref={importInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleImportFile}
              />
              <button
                onClick={handleImportClick}
                className="flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 transition-colors"
              >
                <Upload size={20} />
                <span>Import</span>
              </button>
            </>
          )}

          {permissions.dashboard.export && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 transition-colors"
            >
              <Download size={20} />
              <span>Export</span>
            </button>
          )}

          {(role === 'Admin' || role === 'DataOwner') && (
            <button
              onClick={() => router.push('/ropa/new')}
              className="flex items-center gap-2 h-12 px-6 rounded-xl bg-[#0F172A] text-white font-medium hover:bg-slate-800 transition-colors"
            >
              <Plus size={20} />
              <span>Create ROPA</span>
            </button>
          )}
        </div>
      </div>

      <div
        className={`rounded-3xl overflow-auto shadow-sm border flex-1 transition-all duration-300 ${
          isReviewMode
            ? 'border-[#3b82f6] ring-2 ring-blue-400/20 bg-gray-50'
            : 'border-gray-200 bg-[#E5E7EB]'
        }`}
      >
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead className={`sticky top-0 z-10 ${isReviewMode ? 'bg-gray-50' : 'bg-[#E5E7EB]'}`}>
            <tr className="text-gray-600 font-semibold text-sm border-b border-gray-300">
              <th className="px-8 py-5">ID</th>
              <th className="px-6 py-5">Purpose</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Subject</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5">Legal Basis</th>
              <th className="px-6 py-5">Sensitivity</th>
              <th className="px-6 py-5 flex items-center gap-1">
                Retention Period <ChevronDown size={16} />
              </th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-8 py-12 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-8 py-12 text-center text-gray-500">
                  No ROPA records found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="text-gray-900 font-medium hover:bg-gray-200/50 transition-colors"
                >
                  <td className="px-8 py-6">{row.id}</td>
                  <td className="px-6 py-6 truncate max-w-[200px]">{row.purpose}</td>
                  <td className="px-6 py-6">
                    <div
                      className={`h-4 w-4 rounded-full ${getStatusColor(row.status)} shadow-sm`}
                      title={row.status}
                    ></div>
                  </td>
                  <td className="px-6 py-6">{row.dataSubject}</td>
                  <td className="px-6 py-6">{row.dataCategory}</td>
                  <td className="px-6 py-6">
                    {String(row.legalBasis || '').replace(/_/g, ' ')}
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getRiskBadge(
                        row.riskLevel,
                      )}`}
                    >
                      {row.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="relative inline-block pr-16">
                      <span className="text-lg">{row.retentionPeriod}</span>
                      {isReviewMode && row.status === 'PENDING_REVIEW' && (
                        <span className="absolute -top-3 -right-2 bg-blue-50 text-[#3b82f6] text-[10px] px-2 py-0.5 rounded-full border border-blue-200 font-medium shadow-sm whitespace-nowrap">
                          In Review
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-3">
                      {isReviewMode && row.status === 'PENDING_REVIEW' && (
                        <>
                          <button
                            onClick={() => handleApprove(row)}
                            className="text-gray-900 hover:text-green-600 transition-colors"
                          >
                            <Check size={28} />
                          </button>
                          <button
                            onClick={() => handleReject(row)}
                            className="text-gray-900 hover:text-red-600 transition-colors"
                          >
                            <X size={28} />
                          </button>
                        </>
                      )}
                      {role === 'Admin' && (
                        <button
                          onClick={() => handleDeleteClick(row)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={24} />
                        </button>
                      )}
                      <button
                        onClick={() => handleViewRecord(row)}
                        className="text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <Eye size={24} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
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

      <RecordDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={selectedRecord}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={recordToDelete?.purpose || ''}
      />
    </div>
  );
}
