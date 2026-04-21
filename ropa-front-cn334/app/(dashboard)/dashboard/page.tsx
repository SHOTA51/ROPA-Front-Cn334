'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown
} from 'lucide-react';

import StatCard from '../../../components/StatCard';
import RecordDetailModal from '../../../components/RecordDetailModal';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import { useRole } from '../../../lib/store';

// Demo data for ROPA records
const mockData = [
  { id: 1, purpose: 'การตลาดและโปรโมชั่น', status: 'pending', subject: 'Customer', category: 'Email, Phone', legalBasis: 'Consent', sensitivity: 'High', retentionPeriod: '1 year' },
  { id: 2, purpose: 'ให้บริการลูกค้า', status: 'approved', subject: 'Customer', category: 'Email, Address', legalBasis: 'Legal Obligation', sensitivity: 'Medium', retentionPeriod: '2 years' },
  { id: 3, purpose: 'วิเคราะห์พฤติกรรมผู้ใช้', status: 'rejected', subject: 'Employee', category: 'Cookies, IP', legalBasis: 'Legitimate Interest', sensitivity: 'Low', retentionPeriod: '67 years' },
  { id: 4, purpose: 'จัดการพนักงาน', status: 'rejected', subject: 'Partner', category: 'ID Card, Salary', legalBasis: 'Consent', sensitivity: 'High', retentionPeriod: '2 years' },
  { id: 5, purpose: 'ติดต่อซัพพลายเออร์', status: 'approved', subject: 'Candidate', category: 'Email, Contact Name', legalBasis: 'Contract', sensitivity: 'Medium', retentionPeriod: '67 years' },
  { id: 6, purpose: 'บันทึกกล้องวงจรปิด', status: 'approved', subject: 'Visitor', category: 'Video Recording', legalBasis: 'Consent', sensitivity: 'Low', retentionPeriod: '1 year' },
  { id: 7, purpose: 'ส่งจดหมายข่าว', status: 'approved', subject: 'Subscriber', category: 'Email', legalBasis: 'Consent', sensitivity: 'High', retentionPeriod: '42 years' },
  { id: 8, purpose: 'ระบบบัญชี', status: 'pending', subject: 'Employee', category: 'Bank Account', legalBasis: 'Legal Obligation', sensitivity: 'High', retentionPeriod: '10 years' },
  { id: 9, purpose: 'รับสมัครงาน', status: 'approved', subject: 'Candidate', category: 'Resume', legalBasis: 'Consent', sensitivity: 'Medium', retentionPeriod: '2 years' },
  { id: 10, purpose: 'แคมเปญโฆษณา', status: 'rejected', subject: 'Customer', category: 'Behavioral Data', legalBasis: 'Consent', sensitivity: 'Low', retentionPeriod: '1 year' },
  { id: 11, purpose: 'วิจัยตลาด', status: 'approved', subject: 'Public', category: 'Demographics', legalBasis: 'Legitimate Interest', sensitivity: 'Medium', retentionPeriod: '3 years' },
  { id: 12, purpose: 'บริการหลังการขาย', status: 'pending', subject: 'Customer', category: 'Order History', legalBasis: 'Contract', sensitivity: 'Low', retentionPeriod: '5 years' },
  { id: 13, purpose: 'ระบบความปลอดภัย', status: 'approved', subject: 'Visitor', category: 'Access Log', legalBasis: 'Legitimate Interest', sensitivity: 'Medium', retentionPeriod: '1 year' },
  { id: 14, purpose: 'สวัสดิการพนักงาน', status: 'approved', subject: 'Employee', category: 'Health Info', legalBasis: 'Contract', sensitivity: 'High', retentionPeriod: '5 years' },
  { id: 15, purpose: 'วิเคราะห์ยอดขาย', status: 'rejected', subject: 'Partner', category: 'Financial Data', legalBasis: 'Contract', sensitivity: 'Medium', retentionPeriod: '7 years' },
  { id: 16, purpose: 'จดหมายเวียนภายใน', status: 'approved', subject: 'Employee', category: 'Internal Email', legalBasis: 'Legitimate Interest', sensitivity: 'Low', retentionPeriod: '2 years' },
  { id: 17, purpose: 'กิจกรรมเพื่อสังคม', status: 'pending', subject: 'Participant', category: 'Full Name', legalBasis: 'Consent', sensitivity: 'Low', retentionPeriod: '1 year' },
  { id: 18, purpose: 'ปรับปรุงเว็บไซต์', status: 'approved', subject: 'Visitor', category: 'Usage Statistics', legalBasis: 'Legitimate Interest', sensitivity: 'Low', retentionPeriod: '6 months' },
  { id: 19, purpose: 'อบรมสัมมนา', status: 'approved', subject: 'Attendee', category: 'Contact Details', legalBasis: 'Consent', sensitivity: 'Medium', retentionPeriod: '2 years' },
  { id: 20, purpose: 'การจัดการสินทรัพย์', status: 'pending', subject: 'Employee', category: 'Asset Assignment', legalBasis: 'Contract', sensitivity: 'Low', retentionPeriod: '5 years' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-[#22C55E]';
    case 'rejected': return 'bg-[#EF4444]';
    case 'pending': return 'bg-[#F59E0B]';
    default: return 'bg-gray-400';
  }
};

const getSensitivityBadge = (level: string) => {
  switch (level) {
    case 'High': return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
    case 'Medium': return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    case 'Low': return 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const filterCategories = {
  status: ['approved', 'pending', 'rejected'],
  subject: Array.from(new Set(mockData.map(d => d.subject))),
  legalBasis: Array.from(new Set(mockData.map(d => d.legalBasis))),
  sensitivity: ['High', 'Medium', 'Low'],
};

export default function DashboardPage() {
  const { role, permissions } = useRole();
  const [data, setData] = useState(mockData);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string[] }>({
    status: [],
    subject: [],
    legalBasis: [],
    sensitivity: []
  });

  // Handlers
  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (record: any) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      setData(prev => prev.filter(item => item.id !== recordToDelete.id));
      setRecordToDelete(null);
    }
  };

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
    setActiveFilters({ status: [], subject: [], legalBasis: [], sensitivity: [] });
  };

  // Click outside filter listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtering Logic
  const filteredData = data.filter(row => {
    const matchesSearch = 
      row.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.id.toString().includes(searchQuery);

    const matchesStatus = activeFilters.status.length === 0 || activeFilters.status.includes(row.status);
    const matchesSubject = activeFilters.subject.length === 0 || activeFilters.subject.includes(row.subject);
    const matchesLegalBasis = activeFilters.legalBasis.length === 0 || activeFilters.legalBasis.includes(row.legalBasis);
    const matchesSensitivity = activeFilters.sensitivity.length === 0 || activeFilters.sensitivity.includes(row.sensitivity);

    return matchesSearch && matchesStatus && matchesSubject && matchesLegalBasis && matchesSensitivity;
  });

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
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
            2
          </div>
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] space-y-8">
      {/* Header */}
      <div className="flex-none">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">ROPA - Record of Processing Activities</h1>
      </div>

      {/* Stats Section */}
      <div className="flex gap-6 w-full flex-none">
        <StatCard title="Total Record" value="1,200" icon={ClipboardList} iconColor="text-blue-500" bgColor="bg-blue-50" />
        <StatCard title="Approved" value="900" icon={CheckCircle2} iconColor="text-green-500" bgColor="bg-green-50" />
        <StatCard title="Rejected" value="100" icon={XCircle} iconColor="text-red-500" bgColor="bg-red-50" />
        <StatCard title="Pending" value="200" icon={Clock} iconColor="text-yellow-500" bgColor="bg-yellow-50" extra={pendingExtra} />
      </div>

      {/* Toolbar: Search, Filters, Actions */}
      <div className="flex justify-between items-center bg-transparent gap-4 flex-none relative">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search records..."
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
          
          {permissions.dashboard.import && (
            <button className="flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 transition-colors">
              <Upload size={20} />
              <span>Import</span>
            </button>
          )}
          
          {permissions.dashboard.export && (
            <button className="flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 transition-colors">
              <Download size={20} />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className={`rounded-3xl overflow-auto shadow-sm border flex-1 transition-all duration-300 ${isReviewMode ? 'border-[#3b82f6] ring-2 ring-blue-400/20 bg-gray-50' : 'border-gray-200 bg-[#E5E7EB]'}`}>
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
              <th className="px-6 py-5 flex items-center gap-1">Retention Period <ChevronDown size={16} /></th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {filteredData.map((row) => (
              <tr key={row.id} className="text-gray-900 font-medium hover:bg-gray-200/50 transition-colors">
                <td className="px-8 py-6">{row.id}</td>
                <td className="px-6 py-6 truncate max-w-[200px]">{row.purpose}</td>
                <td className="px-6 py-6"><div className={`h-4 w-4 rounded-full ${getStatusColor(row.status)} shadow-sm`}></div></td>
                <td className="px-6 py-6">{row.subject}</td>
                <td className="px-6 py-6">{row.category}</td>
                <td className="px-6 py-6">{row.legalBasis}</td>
                <td className="px-6 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getSensitivityBadge(row.sensitivity)}`}>
                    {row.sensitivity}
                  </span>
                </td>
                <td className="px-6 py-6">
                   <div className="relative inline-block pr-16">
                     <span className="text-lg">{row.retentionPeriod}</span>
                     {isReviewMode && row.status === 'pending' && (
                       <span className="absolute -top-3 -right-2 bg-blue-50 text-[#3b82f6] text-[10px] px-2 py-0.5 rounded-full border border-blue-200 font-medium shadow-sm whitespace-nowrap">
                         In Review
                       </span>
                     )}
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end items-center gap-3">
                    {isReviewMode && row.status === 'pending' && (
                      <>
                        <button className="text-gray-900 hover:text-green-600 transition-colors"><Check size={28} /></button>
                        <button className="text-gray-900 hover:text-red-600 transition-colors"><X size={28} /></button>
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
                    <button onClick={() => handleViewRecord(row)} className="text-gray-500 hover:text-gray-900 transition-colors"><Eye size={24} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <RecordDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} record={selectedRecord} />
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete}
        itemName={recordToDelete?.purpose || ''}
      />
    </div>
  );
}
